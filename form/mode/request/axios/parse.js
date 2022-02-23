import { esprimaHelper } from '@';

let { astToCode, getPropertyId, getRemark, fn2json } = esprimaHelper;

function parseParams(expr) {
  return expr.properties.map(property2JSON);
}

function property2JSON(p) {
  let { type, value } = expr2Json(p.value);
  return {
    id: getPropertyId(p),
    name: getRemark(p),
    type,
    value,
  };
}

function expr2Json(expr) {
  let type = expr.type == 'Literal' ? typeof expr.value : 'expr';
  let value = expr.type == 'Literal' ? expr.value : astToCode(expr);

  return {
    type,
    value: value,
  };
}

function isAxiosRequest(expr) {
  let isAxios = false;
  let chains = [];
  let axiosParams = {
    type: 'axios',
  };

  function pushChains(expression) {
    if (expression.type == 'CallExpression') {
      let callee = expression.callee;
      if (callee.type != 'MemberExpression') return;
      if (callee.property.type == 'Identifier') {
        let chain = {
          name: callee.property.name,
        };

        if (chain.name == 'then') {
          let thenFn = expression.arguments[0];
          let binds = axiosParams.binds = [];
          let resultId = axiosParams.resultId = thenFn.params[0]?.name;
          let exprs = thenFn.body.body || [thenFn.body];
          let thenExprs = axiosParams.thenExprs = [];
          exprs.forEach(expr => {
            let rex = expr;
            thenExprs.push(rex);

            if (expr.type == 'ExpressionStatement') {
              expr = expr.expression;
            }
            if (expr.type == 'AssignmentExpression') {
              let left = astToCode(expr.left);
              let right = astToCode(expr.right);
              if (left.startsWith('this.') && right.startsWith(`${ resultId }`)) {
                rex.bindPath = left;
                binds.push({
                  path: left,
                  value: right.substring(resultId.length),
                });
              }
            }
          });
        } else if (['get', 'delete', 'post', 'put', 'patch'].includes(chain.name)) {
          let configExpr;
          let config = {};
          let [arg0, arg1, arg2] = expression.arguments;
          let reqData = null;
          axiosParams.method = chain.name;
          axiosParams.url = arg0.value;

          if (['get', 'delete'].includes(chain.name)) {
            configExpr = arg1;
          } else {
            reqData = arg1;
            configExpr = arg2;
          }

          if (configExpr) {
            configExpr.properties.forEach(prop => {
              let propName = getPropertyId(prop);
              if (propName === 'params') {
                config.params = parseParams(prop.value);
              } else {
                config[propName] = property2JSON(prop);
              }
            });
          }

          if (reqData) {
            config.data = expr2Json(reqData);
          }

          axiosParams.config = config;
        }

        chains.unshift(chain);
      }
      pushChains(callee.object);
    } else if (expression.type == 'Identifier' && expression.name == 'axios') {
      isAxios = true;
    }
  }

  if (expr.type == 'ExpressionStatement' && expr.expression.type == 'CallExpression' && expr.expression.callee.type === 'MemberExpression') {
    pushChains(expr.expression);
  }

  if (isAxios) {
    return axiosParams;
  }
}

function parseAxiosRequest(property) {
  let axiosRequest;
  let before = [];
  let after = [];
  property.value.body.body.forEach(expr => {
    if (axiosRequest == null) {
      axiosRequest = isAxiosRequest(expr);
      if (!axiosRequest) {
        before.push(expr);
      }
    } else {
      after.push(expr);
    }
  });

  if (axiosRequest) {
    axiosRequest.before = before.map(expr => astToCode(expr)).join('\n');
    axiosRequest.after = after.map(expr => astToCode(expr)).join('\n');
    Object.assign(axiosRequest, fn2json(property));
  }

  return axiosRequest;
}

export {
  isAxiosRequest,
  parseAxiosRequest,
};
