import { astToCode, parseScript } from '@/helpers/esprimaHelper';

function expr2Json(expr) {
  let type = expr.type == 'Literal' ? typeof expr.value : 'expr';
  let value = expr.type == 'Literal' ? expr.value : astToCode(expr);

  return {
    type,
    value: value,
  };
}

let parserMap = {
  VariableDeclaration(ex) {
    return {
      title: '申明变量',
      type: ex.type,
      children: ex.declarations.map(declarator => {
        let value = expr2Json(declarator.init);
        return {
          title: declarator.id.name + ' = ' + value.value,
          type: declarator.type,
          value,
        };
      }),
      toCode() {
        return `var ${ this.children.map(c => c.title).join(',') };`;
      },
    };
  },
  IfStatement(ex) {
    var data = {
      test: {
        type: ex.test.type,
      },
      children: ex.consequent.body.map(parseExpr),
      component: 'if',
      toCode() {
        return `if(${ this.test.toCode() }){
  ${ this.children.map(child => child.toCode()).join('\n') }
}`;
      },
    };
    if (ex.test.type === 'BinaryExpression') {
      data.test.toCode = function () {
        return `getComponent('${ data.test.name }').${ data.test.method }()` + data.test.oper + data.test.right;
      };
      data.test.left = astToCode(ex.test.left);
      data.test.oper = ex.test.operator;
      data.test.right = astToCode(ex.test.right);
      data.test.name = data.test.left.indexOf('文本框') == -1 ? '下拉框' : '文本框';
      data.test.method = data.test.left.indexOf('getValue') == -1 ? 'setValue' : 'getValue';

    } else {
      data.test.value = expr2Json(ex.test).value;
      data.test.toCode = function () {
        return data.test.value;
      };
    }

    return data;
  },
  ExpressionStatement: function (ex) {

    if (ex.expression.type == 'CallExpression') {
      ex = ex.expression;
      let callee = ex.callee;
      let args = ex.arguments;
      if (callee.type == 'Identifier') {
        if (callee.name == 'openUrl') {
          return {
            url: args[0] ? astToCode(args[0]) : '',
            component: 'openUrl',
            toCode() {
              return `openUrl(${ this.url });`;
            },
          };
        }
        if (callee.name == 'hideComponent') {
          return {
            value: expr2Json(args[0]).value,
            component: 'hideComponent',
            toCode() {
              return `hideComponent('${ this.value }');`;
            },
          };
        }
      } else {
        let ds = isDataSource(ex);
        if (ds) {
          return ds;
        }
      }
      return {
        title: expr2Json(ex).value,
        toCode() {
          return this.title + ';';
        },
      };
    } else if (ex.expression.type == 'BinaryExpression') {
      ex = ex.expression;
      if (['!=', '==', '>', '<'].includes(ex.operator)) {
        let field = astToCode(ex.left).split('.')[1];
        return {
          field,
          operator: ex.operator,
          value: astToCode(ex.right),
          component: 'audit1',
          toCode() {
            return `row.${ this.field } ${ this.operator } ${ this.value }`;
          },


        };
      }

    }

    if (ex.expression.type == 'LogicalExpression') {
      return {
        component: 'logic',
        toCode() {
          return `row.ZZJGDM == '' || (length(row.ZZJGDM) != 9 && row.ZZJGDM == 'A12345678')`;
        },
      };
    }


    return {
      title: expr2Json(ex).value,
      toCode() {
        return this.title;
      },
    };
  },
};

function isDataSource(expr) {
  let dataSource = {
    component: 'dataSource',
    children: [],
    toCode() {
      let chians = [`getDataSource('${ this.value }')`];
      this.children.forEach(child => {
        chians.push(`filter('${ child.field }','${ child.oper }','${ child.value }')`);
      });
      return chians.join('.');
    },
  };
  let isDataSource = false;

  function pushChains(expression) {
    if (expression.type == 'CallExpression') {
      let callee = expression.callee;
      let [arg0, arg1, arg2] = expression.arguments;
      let t = callee.property || callee;
      if (t.type == 'Identifier') {
        let chain = {
          name: t.name,
        };
        if (chain.name == 'getDataSource') {
          dataSource.value = arg0.value;
          isDataSource = true;
        } else if (['filter'].includes(chain.name)) {
          dataSource.children.unshift({
            field: arg0.value,
            oper: arg1.value,
            value: arg2.value,
            component: 'dataSourceFilter',
          });
        }
      }
      if (callee.type === 'MemberExpression') {
        pushChains(callee.object);
      }
    }
  }

  if (expr.type == 'CallExpression' && expr.callee.type === 'MemberExpression') {
    pushChains(expr);
  }

  if (isDataSource) return dataSource;

}

function registerAstParser(type, parser) {
  parserMap[type] = parserMap[type] || [];
  parserMap[type].push(parser);
}

function parseExpr(expr) {
  let parser = parserMap[expr.type];
  if (parser) {
    return parser(expr);
  }
  return {
    title: astToCode(expr),
    toCode() {
      return this.title;
    },
  };
}

function parseCode(code) {
  let Program = parseScript(code);
  return Program.body.map(parseExpr);
}

import QueryConditionGroup from './query-condition-group';

const compoents = {
  dataSource(dataRef) {
    return <>
      <span>过滤数据源</span>
      <a-select style="width:100px" v-model={ [dataRef.value, 'value'] } size="small">
        <a-select-option value="文本框1">文本框1</a-select-option>
        <a-select-option value="文本框2">文本框2</a-select-option>
        <a-select-option value="表格1">表格1</a-select-option>
      </a-select>

      <a-button size="small" onClick={ () => dataRef.children.push({ field: '', oper: '=', value: '' }) }>+</a-button>

    </>;
  },
  dataSourceFilter(dataRef) {
    return <a-input-group compact>
      <a-select style="width:80px" v-model={ [dataRef.field, 'value'] } size="small">
        <a-select-option value="姓名">姓名</a-select-option>
        <a-select-option value="性别">性别</a-select-option>
      </a-select>
      <a-select style="width:50px" v-model={ [dataRef.oper, 'value'] } size="small">
        <a-select-option value="=">=</a-select-option>
        <a-select-option value="!=">!=</a-select-option>
      </a-select>
      <a-input v-model={ [dataRef.value, 'value'] } size="small"></a-input>
    </a-input-group>;
  },
  hideComponent(data) {
    return <>
      <span>隐藏组件</span>
      <a-select style="width:100px" v-model={ [data.value, 'value'] } size="small">
        <a-select-option value="文本框1">文本框1</a-select-option>
        <a-select-option value="文本框2">文本框2</a-select-option>
        <a-select-option value="表格1">表格1</a-select-option>
      </a-select>
    </>;
  },
  openUrl(data) {
    return <>
      <span>打开窗口</span>
      <a-input v-model={ [data.url, 'value'] } size="small"></a-input>
    </>;
  },
  if(data) {

    if (data.test.type === 'BinaryExpression') {
      return <>
        <a-input-group compact>
          <span>如果</span>
          <a-select style="width:80px" v-model={ [data.test.name, 'value'] } size="small">
            <a-select-option value="文本框">文本框</a-select-option>
            <a-select-option value="下拉框">下拉框</a-select-option>
          </a-select>
          <a-select style="width:80px" v-model={ [data.test.method, 'value'] } size="small">
            <a-select-option value="getValue">获取值</a-select-option>
            <a-select-option value="setValue">设置值</a-select-option>
          </a-select>
          <a-select style="width:80px" v-model={ [data.test.oper, 'value'] } size="small">
            <a-select-option value="==">等于</a-select-option>
            <a-select-option value="!=">不等于</a-select-option>
          </a-select>
          <a-input v-model={ [data.test.right, 'value'] } size="small"></a-input>
        </a-input-group>
      </>;
    }

    return <>
      <span>如果</span>
      <a-input v-model={ [data.test.value, 'value'] } size="small"></a-input>
    </>;
  },
  audit1(dataRef) {
    return <a-input-group compact>
      <a-select style="width:180px" v-model={ [dataRef.field, 'value'] } size="small">
        <a-select-option value="zzjgdm">组织机构代码</a-select-option>
        <a-select-option value="tyshxym">统一社会信用码</a-select-option>
      </a-select>
      <a-select style="width:80px" v-model={ [dataRef.operator, 'value'] } size="small">
        <a-select-option value="==">等于</a-select-option>
        <a-select-option value="!=">不等于</a-select-option>
      </a-select>
      <a-input v-model={ [dataRef.value, 'value'] } size="small"></a-input>
    </a-input-group>;
  },
  logic(data) {
    let conditionGroup = {
      logic: 'OR',
      children: [
        {
          fields: [
            {
              label: '组织机构代码',
              value: 'ZZGJDM',
            },
            {
              label: '统一社会信用码',
              value: 'TYSHXYM',
            },
          ],
          field: 'ZZGJDM',
          operation: '==',
          value: '',
        },
        {
          logic:'AND',
          children:[
            {
              fields: [
                {
                  label: '组织机构代码',
                  value: 'ZZGJDM',
                },
                {
                  label: '统一社会信用码',
                  value: 'TYSHXYM',
                },
              ],
              field: 'ZZGJDM',
              operation: '!=',
              value: '9',
              extr: 'length',
              extrs: [
                {
                  label: '长度',
                  value: 'length',
                },
                {
                  label: '去除空格',
                  value: 'trim',
                },
              ],
            },
            {
              fields: [
                {
                  label: '组织机构代码',
                  value: 'ZZGJDM',
                },
                {
                  label: '统一社会信用码',
                  value: 'TYSHXYM',
                },
              ],
              field: 'ZZGJDM',
              operation: '==',
              value: 'A12345678',
            },
          ]
        },
      ],
    };
    return <QueryConditionGroup conditionGroup={ conditionGroup }></QueryConditionGroup>;
  },


};

function getComponent(id) {
  return compoents[id];
}

export {
  registerAstParser,
  parseCode,
  getComponent,
};
