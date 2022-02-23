import * as runtimeDom from '@vue/runtime-dom';
import { compile, parse, generate } from '@vue/compiler-dom';
import { extend, generateCodeFrame } from '@vue/shared';
//import { generate } from './genCode.js';

const compileCache = Object.create(null);

function compileToFunction(template, options) {
  const key = template;
  const cached = compileCache[key];
  if (cached) {
    return cached;
  }

  const { code, ast } = compile(
      template,
      extend(
          {
            hoistStatic: true,
            onError(err) {
              if (process.env.NODE_ENV !== 'production') {
                const message = `Template compilation error: ${ err.message }`;
                const codeFrame = err.loc && generateCodeFrame(template, err.loc.start.offset, err.loc.end.offset);
                console.warn(codeFrame ? `${ message }\n${ codeFrame }` : message);
              } else {
                /* istanbul ignore next */
                throw err;
              }
            },
          },
          options,
      ),
  );
//  let render = new Function('Vue', code)(runtimeDom);
//  render._rc = true;

  setPatchFlag(ast);

  const t = generate(ast, { prefixIdentifiers: false });
  let render1 = new Function('Vue', t.code)(runtimeDom);
  render1._rc = true;
  return ( compileCache[key] = render1 );
}

function parseAst(template, options) {
  return parse(template, extend({}, options));
}

// 去除优化
function setPatchFlag(node) {
  if (node.codegenNode) {
    node.codegenNode.patchFlag = '-2 /* BAIL */';
  }
  node.children?.forEach(setPatchFlag);
}

export { compileToFunction, parseAst };
