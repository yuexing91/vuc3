import { isArray, isString, isSymbol } from '@vue/shared';
import {
  CREATE_BLOCK,
  CREATE_COMMENT,
  CREATE_STATIC,
  CREATE_TEXT,
  CREATE_VNODE,
  OPEN_BLOCK,
  RESOLVE_COMPONENT,
  RESOLVE_DIRECTIVE,
  SET_BLOCK_TRACKING,
  TO_DISPLAY_STRING,
  WITH_CTX,
  WITH_DIRECTIVES,
  assert,
  helperNameMap,
  isSimpleIdentifier,
  toValidAssetId,
} from '@vue/compiler-core';

const PURE_ANNOTATION = `/*#__PURE__*/`;

function createCodegenContext(
  ast,
  {
    mode = 'function',
    prefixIdentifiers = mode === 'module',
    sourceMap = false,
    filename = `template.vue.html`,
    scopeId = null,
    optimizeImports = false,
    runtimeGlobalName = `Vue`,
    runtimeModuleName = `vue`,
    ssr = false,
  }
) {
  const context = {
    mode,
    prefixIdentifiers,
    sourceMap,
    filename,
    scopeId,
    optimizeImports,
    runtimeGlobalName,
    runtimeModuleName,
    ssr,
    source: ast.loc.source,
    code: ``,
    column: 1,
    line: 1,
    offset: 0,
    indentLevel: 0,
    pure: false,
    map: undefined,
    helper(key) {
      return `_${helperNameMap[key]}`;
    },
    push(code, node) {
      context.code += code;
    },
    indent() {
      newline(++context.indentLevel);
    },
    deindent(withoutNewLine = false) {
      if (withoutNewLine) {
        --context.indentLevel;
      } else {
        newline(--context.indentLevel);
      }
    },
    newline() {
      newline(context.indentLevel);
    },
  };

  function newline(n) {
    context.push('\n' + `  `.repeat(n));
  }

  return context;
}

function generate(ast, options = {}) {
  const context = createCodegenContext(ast, options);
  if (options.onContextCreated) options.onContextCreated(context);
  const { mode, push, prefixIdentifiers, indent, deindent, newline, scopeId, ssr } = context;
  const hasHelpers = ast.helpers.length > 0;
  const useWithBlock = !prefixIdentifiers && mode !== 'module';
  // preambles
  // in setup() inline mode, the preamble is generated in a sub context
  // and returned separately.
  const preambleContext = context;
  {
    genFunctionPreamble(ast, preambleContext);
  }
  // enter render function
  const functionName = ssr ? `ssrRender` : `render`;
  const args = ssr ? ['_ctx', '_push', '_parent', '_attrs'] : ['_ctx', '_cache'];
  const signature = args.join(', ');
  {
    push(`function ${functionName}(${signature}) {`);
  }
  indent();
  if (useWithBlock) {
    push(`with (_ctx) {`);
    indent();
    // function mode const declarations should be inside with block
    // also they should be renamed to avoid collision with user properties
    if (!ast.helpers.includes(CREATE_VNODE)) {
      ast.helpers.push(CREATE_VNODE);
    }
    if (hasHelpers) {
      push(`const { ${ast.helpers.map((s) => `${helperNameMap[s]}: _${helperNameMap[s]}`).join(', ')} } = _Vue`);
      push(`\n`);
      newline();
    }
  }
  // generate asset resolution statements
  if (ast.components.length) {
    genAssets(ast.components, 'component', context);
    if (ast.directives.length || ast.temps > 0) {
      newline();
    }
  }
  if (ast.directives.length) {
    genAssets(ast.directives, 'directive', context);
    if (ast.temps > 0) {
      newline();
    }
  }
  if (ast.temps > 0) {
    push(`let `);
    for (let i = 0; i < ast.temps; i++) {
      push(`${i > 0 ? `, ` : ``}_temp${i}`);
    }
  }
  if (ast.components.length || ast.directives.length || ast.temps) {
    push(`\n`);
    newline();
  }
  // generate the VNode tree expression
  if (!ssr) {
    push(`return `);
  }
  if (ast.codegenNode) {
    genNode(ast.codegenNode, context);
  } else {
    push(`null`);
  }
  if (useWithBlock) {
    deindent();
    push(`}`);
  }
  deindent();
  push(`}`);
  return {
    ast,
    code: context.code,
    preamble: ``,
    // SourceMapGenerator does have toJSON() method but it's not in the types
    map: context.map ? context.map.toJSON() : undefined,
  };
}

function genFunctionPreamble(ast, context) {
  const { ssr, prefixIdentifiers, push, newline, runtimeModuleName, runtimeGlobalName } = context;
  const VueBinding = runtimeGlobalName;
  const aliasHelper = (s) => `${helperNameMap[s]}: _${helperNameMap[s]}`;
  // Generate const declaration for helpers
  // In prefix mode, we place the const declaration at top so it's done
  // only once; But if we not prefixing, we place the declaration inside the
  // with block so it doesn't incur the `in` check cost for every helper access.
  if (ast.helpers.length > 0) {
    {
      // "with" mode.
      // save Vue in a separate variable to avoid collision
      push(`const _Vue = ${VueBinding}\n`);
      // in "with" mode, helpers are declared inside the with block to avoid
      // has check cost, but hoists are lifted out of the function - we need
      // to provide the helper here.
      if (ast.hoists.length) {
        const staticHelpers = [CREATE_VNODE, CREATE_COMMENT, CREATE_TEXT, CREATE_STATIC]
          //          .filter((helper) => ast.helpers.includes(helper))
          .map(aliasHelper)
          .join(', ');
        push(`const { ${staticHelpers} } = _Vue\n`);
      }
    }
  }
  genHoists(ast.hoists, context);
  newline();
  push(`return `);
}

function genAssets(assets, type, { helper, push, newline }) {
  const resolver = helper(type === 'component' ? RESOLVE_COMPONENT : RESOLVE_DIRECTIVE);
  for (let i = 0; i < assets.length; i++) {
    let id = assets[i];
    // potential component implicit self-reference inferred from SFC filename
    const maybeSelfReference = id.endsWith('__self');
    if (maybeSelfReference) {
      id = id.slice(0, -6);
    }
    push(`const ${toValidAssetId(id, type)} = ${resolver}(${JSON.stringify(id)}${maybeSelfReference ? `, true` : ``})`);
    if (i < assets.length - 1) {
      newline();
    }
  }
}

function genHoists(hoists, context) {
  if (!hoists.length) {
    return;
  }
  context.pure = true;
  const { push, newline, helper, scopeId, mode } = context;
  newline();
  hoists.forEach((exp, i) => {
    if (exp) {
      push(`const _hoisted_${i + 1} = `);
      genNode(exp, context);
      newline();
    }
  });
  context.pure = false;
}

function isText$1(n) {
  return (
    isString(n) ||
    n.type === 4 /* SIMPLE_EXPRESSION */ ||
    n.type === 2 /* TEXT */ ||
    n.type === 5 /* INTERPOLATION */ ||
    n.type === 8 /* COMPOUND_EXPRESSION */
  );
}

function genNodeListAsArray(nodes, context) {
  const multilines =
    nodes.length > 3 || (process.env.NODE_ENV !== 'production' && nodes.some((n) => isArray(n) || !isText$1(n)));
  context.push(`[`);
  multilines && context.indent();
  genNodeList(nodes, context, multilines);
  multilines && context.deindent();
  context.push(`]`);
}

function genNodeList(nodes, context, multilines = false, comma = true) {
  const { push, newline } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isString(node)) {
      push(node);
    } else if (isArray(node)) {
      genNodeListAsArray(node, context);
    } else {
      genNode(node, context);
    }
    if (i < nodes.length - 1) {
      if (multilines) {
        comma && push(',');
        newline();
      } else {
        comma && push(', ');
      }
    }
  }
}

function genNode(node, context) {
  if (isString(node)) {
    context.push(node);
    return;
  }
  if (isSymbol(node)) {
    context.push(context.helper(node));
    return;
  }
  switch (node.type) {
    case 1 /* ELEMENT */:
    case 9 /* IF */:
    case 11 /* FOR */:
      process.env.NODE_ENV !== 'production' &&
        assert(
          node.codegenNode != null,
          `Codegen node is missing for element/if/for node. ` + `Apply appropriate transforms first.`
        );
      genNode(node.codegenNode, context);
      break;
    case 2 /* TEXT */:
      genText(node, context);
      break;
    case 4 /* SIMPLE_EXPRESSION */:
      genExpression(node, context);
      break;
    case 5 /* INTERPOLATION */:
      genInterpolation(node, context);
      break;
    case 12 /* TEXT_CALL */:
      genNode(node.codegenNode, context);
      break;
    case 8 /* COMPOUND_EXPRESSION */:
      genCompoundExpression(node, context);
      break;
    case 3 /* COMMENT */:
      genComment(node, context);
      break;
    case 13 /* VNODE_CALL */:
      genVNodeCall(node, context);
      break;
    case 14 /* JS_CALL_EXPRESSION */:
      genCallExpression(node, context);
      break;
    case 15 /* JS_OBJECT_EXPRESSION */:
      genObjectExpression(node, context);
      break;
    case 17 /* JS_ARRAY_EXPRESSION */:
      genArrayExpression(node, context);
      break;
    case 18 /* JS_FUNCTION_EXPRESSION */:
      genFunctionExpression(node, context);
      break;
    case 19 /* JS_CONDITIONAL_EXPRESSION */:
      genConditionalExpression(node, context);
      break;
    case 20 /* JS_CACHE_EXPRESSION */:
      genCacheExpression(node, context);
      break;
    // SSR only types
    case 21 /* JS_BLOCK_STATEMENT */:
      break;
    case 22 /* JS_TEMPLATE_LITERAL */:
      break;
    case 23 /* JS_IF_STATEMENT */:
      break;
    case 24 /* JS_ASSIGNMENT_EXPRESSION */:
      break;
    case 25 /* JS_SEQUENCE_EXPRESSION */:
      break;
    case 26 /* JS_RETURN_STATEMENT */:
      break;
    /* istanbul ignore next */
    case 10 /* IF_BRANCH */:
      // noop
      break;
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, `unhandled codegen node type: ${node.type}`);
        // make sure we exhaust all possible types
        const exhaustiveCheck = node;
        return exhaustiveCheck;
      }
  }
}

function genText(node, context) {
  context.push(JSON.stringify(node.content), node);
}

function genExpression(node, context) {
  const { content, isStatic } = node;
  context.push(isStatic ? JSON.stringify(content) : content, node);
}

function genInterpolation(node, context) {
  const { push, helper, pure } = context;
  if (pure) push(PURE_ANNOTATION);
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}

function genCompoundExpression(node, context) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (isString(child)) {
      context.push(child);
    } else {
      genNode(child, context);
    }
  }
}

function genExpressionAsPropertyKey(node, context) {
  const { push } = context;
  if (node.type === 8 /* COMPOUND_EXPRESSION */) {
    push(`[`);
    genCompoundExpression(node, context);
    push(`]`);
  } else if (node.isStatic) {
    // only quote keys if necessary
    const text = isSimpleIdentifier(node.content) ? node.content : JSON.stringify(node.content);
    push(text, node);
  } else {
    push(`[${node.content}]`, node);
  }
}

function genComment(node, context) {
  if (process.env.NODE_ENV !== 'production') {
    const { push, helper, pure } = context;
    if (pure) {
      push(PURE_ANNOTATION);
    }
    push(`${helper(CREATE_COMMENT)}(${JSON.stringify(node.content)})`, node);
  }
}

function genVNodeCall(node, context) {
  const { push, helper, pure } = context;
  let { tag, props, children, patchFlag, dynamicProps, directives, isBlock, disableTracking } = node;
  if (directives) {
    push(helper(WITH_DIRECTIVES) + `(`);
  }
  // 去除优化
  isBlock = false;
  patchFlag = '-2 /* BAIL */';
  dynamicProps = null;
  //
  if (isBlock) {
    push(`(${helper(OPEN_BLOCK)}(${disableTracking ? `true` : ``}), `);
  }
  if (pure) {
    push(PURE_ANNOTATION);
  }
  push(helper(isBlock ? CREATE_BLOCK : CREATE_VNODE) + `(`, node);
  genNodeList(genNullableArgs([tag, props, children, patchFlag, dynamicProps]), context);
  push(`)`);
  if (isBlock) {
    push(`)`);
  }
  if (directives) {
    push(`, `);
    genNode(directives, context);
    push(`)`);
  }
}

function genNullableArgs(args) {
  let i = args.length;
  while (i--) {
    if (args[i] != null) break;
  }
  return args.slice(0, i + 1).map((arg) => arg || `null`);
}

// JavaScript
function genCallExpression(node, context) {
  const { push, helper, pure } = context;
  const callee = isString(node.callee) ? node.callee : helper(node.callee);
  if (pure) {
    push(PURE_ANNOTATION);
  }
  push(callee + `(`, node);
  genNodeList(node.arguments, context);
  push(`)`);
}

function genObjectExpression(node, context) {
  const { push, indent, deindent, newline } = context;
  const { properties } = node;
  if (!properties.length) {
    push(`{}`, node);
    return;
  }
  const multilines =
    properties.length > 1 ||
    (process.env.NODE_ENV !== 'production' && properties.some((p) => p.value.type !== 4 /* SIMPLE_EXPRESSION */));
  push(multilines ? `{` : `{ `);
  multilines && indent();
  for (let i = 0; i < properties.length; i++) {
    const { key, value } = properties[i];
    // key
    genExpressionAsPropertyKey(key, context);
    push(`: `);
    // value
    genNode(value, context);
    if (i < properties.length - 1) {
      // will only reach this if it's multilines
      push(`,`);
      newline();
    }
  }
  multilines && deindent();
  push(multilines ? `}` : ` }`);
}

function genArrayExpression(node, context) {
  genNodeListAsArray(node.elements, context);
}

function genFunctionExpression(node, context) {
  const { push, indent, deindent, scopeId, mode } = context;
  const { params, returns, body, newline, isSlot } = node;
  if (isSlot) {
    // wrap slot functions with owner context
    push(`_${helperNameMap[WITH_CTX]}(`);
  }
  push(`(`, node);
  if (isArray(params)) {
    genNodeList(params, context);
  } else if (params) {
    genNode(params, context);
  }
  push(`) => `);
  if (newline || body) {
    push(`{`);
    indent();
  }
  if (returns) {
    if (newline) {
      push(`return `);
    }
    if (isArray(returns)) {
      genNodeListAsArray(returns, context);
    } else {
      genNode(returns, context);
    }
  } else if (body) {
    genNode(body, context);
  }
  if (newline || body) {
    deindent();
    push(`}`);
  }
  if (isSlot) {
    push(`)`);
  }
}

function genConditionalExpression(node, context) {
  const { test, consequent, alternate, newline: needNewline } = node;
  const { push, indent, deindent, newline } = context;
  if (test.type === 4 /* SIMPLE_EXPRESSION */) {
    const needsParens = !isSimpleIdentifier(test.content);
    needsParens && push(`(`);
    genExpression(test, context);
    needsParens && push(`)`);
  } else {
    push(`(`);
    genNode(test, context);
    push(`)`);
  }
  needNewline && indent();
  context.indentLevel++;
  needNewline || push(` `);
  push(`? `);
  genNode(consequent, context);
  context.indentLevel--;
  needNewline && newline();
  needNewline || push(` `);
  push(`: `);
  const isNested = alternate.type === 19; /* JS_CONDITIONAL_EXPRESSION */
  if (!isNested) {
    context.indentLevel++;
  }
  genNode(alternate, context);
  if (!isNested) {
    context.indentLevel--;
  }
  needNewline && deindent(true /* without newline */);
}

function genCacheExpression(node, context) {
  const { push, helper, indent, deindent, newline } = context;
  push(`_cache[${node.index}] || (`);
  if (node.isVNode) {
    indent();
    push(`${helper(SET_BLOCK_TRACKING)}(-1),`);
    newline();
  }
  push(`_cache[${node.index}] = `);
  genNode(node.value, context);
  if (node.isVNode) {
    push(`,`);
    newline();
    push(`${helper(SET_BLOCK_TRACKING)}(1),`);
    newline();
    push(`_cache[${node.index}]`);
    deindent();
  }
  push(`)`);
}

export { generate };
