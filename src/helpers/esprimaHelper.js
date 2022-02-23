import * as esprima from 'esprima';
import escodegen from 'escodegen';

function parseModule(content) {
  return esprima.parseModule(content, {
    range: true,
    attachComment: true,
  });
}

function parseScript(content) {
  return esprima.parse(content, {
    range: true,
    attachComment: true,
  });
}

function parseExpression(code) {
  if (code.trim().startsWith('{')) {
    code = `(${ code })`;
  }

  let Program = parseScript(code);
  if (Program.body[0]) {
    return Program.body[0].expression;
  }
}

function extractAnnotations(leadingComments) {
  let annotations = [];
  let remark = [];
  leadingComments?.forEach((comment) => {
    comment.value.split('\n').forEach((line) => {
      line = line.replace(/^[\s\*]*/, '');
      if (line.startsWith('@')) {
        let t = line.split(/\s+/);
        annotations.push({
          name: t[0],
          params: t.slice(1),
        });
      } else {
        if (line) {
          remark.push(line);
        }
      }
    });
  });

  function find(name) {
    return annotations.find((a) => a.name === '@' + name);
  }

  function filter(name) {
    return annotations.filter((a) => a.name === '@' + name);
  }

  function getParams() {
    return filter('param').map((param) => {
      let id = param.params[0];
      let req = !id.startsWith('[');
      return {
        id: req ? id : id.substring(1, id.length - 1),
        req,
        desc: param.params[1],
      };
    });
  }

  return {
    remark(val) {
      if (val) {
        remark = val.split('\n');
        return;
      }
      return remark.join('\n');
    },
    filter,
    find,
    getParams,
    getAnnotations() {
      return annotations;
    },
  };
}

function fn2json(expr) {
  let Annotations = extractAnnotations(expr.leadingComments);
  //显示名称
  let nameAnnotation = Annotations.find('name');
  let name = nameAnnotation ? nameAnnotation.params[0] : '';

  let annotationParams = Annotations.getParams();

  let funExpr;
  let id;

  if (expr.type === 'FunctionExpression') {
    funExpr = expr;
    id = expr.id;
  } else if (expr.type === 'Property') {
    funExpr = expr.value;
    id = getPropertyId(expr);
  } else {
    throw Error();
  }

  let params = funExpr.params.map((param) => {
    let annotation = annotationParams.find((p) => p.id == param.name) || {};
    return {
      id: param.name,
      desc: annotation.desc,
      req: annotation.req,
    };
  });

  let annotations = Annotations.getAnnotations().filter(a => a.name !== '@param' && a.name !== '@name');
  let remark = Annotations.remark();

  return {
    id,
    name,
    params,
    annotations,
    remark,
    code: genFunBodyCode(funExpr),
  };
}

function genFunBodyCode(expr) {
  return expr.body.body.map(e => astToCode(e)).join('\n');
}

function astToCode(ast, opt = { comment: true }) {
  let code = escodegen.generate(ast, opt);
  return code;
}

function updateProperty(properties, property, propertyId) {
  let oldProperty = properties.find((p) => getPropertyId(p) == propertyId);
  if (oldProperty) {
    let index = properties.indexOf(oldProperty);
    properties.splice(index, 1, property);
    return index;
  } else {
    properties.push(property);
    return -1;
  }
}

function getFirstProperty(objExpr) {
  if (typeof objExpr == 'string') {
    objExpr = parseExpression(objExpr);
  }
  return objExpr.properties[0];
}

function jsonObjToCode(jsonObj) {
  return astToCode(parseExpression(JSON.stringify(jsonObj)));
}

function formatCode(code) {
  return astToCode(parseScript(code));
}

function getRemark(expr) {
  let Annotations = extractAnnotations(expr.leadingComments);
  return Annotations.remark();
}

/***
 * [对象属性|数组元素]转为JSON对象
 */
function objectPropertyExpr2JSON(property, parentPath, arrayIndex) {
  let Annotations = extractAnnotations(property.leadingComments);
  let id, value, path;
  let json = {};
  let children = [];

  if (property.type == 'Property') {
    value = property.value;
    path = id = getPropertyId(property);
    if (parentPath) {
      path = parentPath + '.' + path;
    }
  } else {
    value = property;
    id = `[${ arrayIndex }]`;
    path = `${ parentPath }[${ arrayIndex }]`;
  }

  let type = 'expr';

  if (value.type == 'ObjectExpression') {
    children = objectExpr2JSON(value, path);
    type = 'object';
  } else if (value.type == 'ArrayExpression') {
    children = objectExpr2JSON(value, path);
    type = 'array';
  } else if (value.type == 'Literal') {
    type = typeof value.value;
  }

  Object.assign(json, {
    id,
    name: Annotations.remark(),
    value,
    path,
    type,
  });

  if (children.length) {
    json.children = children;
  }

  Object.defineProperty(json, 'code', {
    get() {
      return astToCode(this.value);
    },
  });

  return json;
}

/***
 * 对象|数组转为JSON对象
 */
function objectExpr2JSON(expression, parentPath) {
  if (expression.type == 'ObjectExpression') {
    return expression.properties.map(property => objectPropertyExpr2JSON(property, parentPath));
  } else if (expression.type == 'ArrayExpression') {
    return expression.elements.map((ele, index) => objectPropertyExpr2JSON(ele, parentPath, index));
  }
}

function getPropertyId(property) {
  return property.key.type == 'Literal' ? property.key.value : property.key.name;
}

export {
  parseModule,
  parseScript,
  parseExpression,
  extractAnnotations,
  fn2json,
  genFunBodyCode,
  updateProperty,
  getFirstProperty,
  astToCode,
  jsonObjToCode,
  formatCode,
  getRemark,
  objectExpr2JSON,
  objectPropertyExpr2JSON,
  getPropertyId,
};
