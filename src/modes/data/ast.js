import get from 'lodash-es/get';
import last from 'lodash-es/last';
import toPath from 'lodash-es/toPath';


import {
  getFirstProperty,
  updateProperty,
  parseExpression,
  objectExpr2JSON,
  objectPropertyExpr2JSON,
  getPropertyId,
} from '@/helpers/esprimaHelper.js';

import { parsePath } from '@/helpers/lang';

function vucAstDataProcess(vucAst) {
  function parseData(data) {
    let newValue;
    let dataExpression;
    let path = data.path || data.id;

    try {
      newValue = new Function('return ' + data.code).call(vucAst.vucInstance);
    } catch (e) {
      console.error(e);
      return e.description || e.message;
    }


    let { parentPath, arrayIndex, isArray } = parsePath(path);
    let comments = data.name ? `/*${ data.name }*/` : '';
    if (isArray) {
      dataExpression = parseExpression(`[ ${ comments } ${ data.code } ]`).elements[0];
    } else {
      dataExpression = getFirstProperty(`{ ${ comments } ${ data.id }: ${ data.code } }`);
    }

    data = objectPropertyExpr2JSON(dataExpression, parentPath, arrayIndex);

    return {
      newValue,
      arrayIndex,
      parentPath,
      data,
      dataExpression,
    };

  }

  vucAst.dataProperty = vucAst.getExportProperty('data', getFirstProperty('{ data() { return {} } }'));
  let dataReturnExpr = last(vucAst.dataProperty.value.body.body).argument;
  vucAst.dataProperties = dataReturnExpr.properties;
  vucAst.datas = objectExpr2JSON(dataReturnExpr);

  Object.assign(vucAst, {
    saveData(data, oldId) {
      let option = parseData(data);
      option.oldId = oldId || data.id;

      if (option.parentPath) {
        this.saveOtherData(option);
      } else {
        this.saveRootData(option);
      }
    },

    saveRootData({ dataExpression, oldId, newValue, data }) {
      let { dataProperties, datas } = this;
      let index = updateProperty(dataProperties, dataExpression, oldId);
      if (index != -1) {
        datas.splice(index, 1, data);
        delVmData(this.vucInstance, oldId);
      } else {
        datas.push(data);
      }
      setRootData(this.vucInstance, data.id, newValue);
    },

    saveOtherData({ dataExpression, oldId, newValue, parentPath, arrayIndex, data }) {
      let parentExpression = this.getDataProperty(parentPath);
      if (parentExpression == null) {
        return console.error(`saveData:不能找到 ${ parentPath }`);
      }
      if (parentExpression.type === 'Property') {
        parentExpression = parentExpression.value;
      }

      let parentData = this.getDataByPath(parentPath);
      let parentObj = get(this.vucInstance, parentPath);
      let index;

      if (parentExpression.type == 'ObjectExpression') {
        let properties = parentExpression.properties;
        index = updateProperty(properties, dataExpression, oldId);
        delete parentObj[oldId];
        parentObj[data.id] = newValue;
      } else if (parentExpression.type == 'ArrayExpression') {
        let elements = parentExpression.elements;
        elements.splice(arrayIndex, 1, dataExpression);
        index = arrayIndex;
        if (index != -1) {
          parentObj.splice(index, 1, newValue);
        } else {
          parentObj.push(newValue);
        }
      }

      if (index != -1) {
        parentData.children.splice(index, 1, data);
      } else {
        if (!parentData.children) parentData.children = [];
        parentData.children.push(data);
      }
    },

    delData(path) {
      let { parentPath, arrayIndex, isArray, id } = parsePath(path);

      if (parentPath) {
        let parentExpression = this.getDataProperty(parentPath);
        if (parentExpression.type === 'Property') {
          parentExpression = parentExpression.value;
        }

        let parentData = this.getDataByPath(parentPath);
        let parentObj = get(this.vucInstance, parentPath);
        let index;

        if (parentExpression.type == 'ObjectExpression' && !isArray) {
          let properties = parentExpression.properties;
          index = properties.findIndex(findByKeyName(id));
          properties.splice(index, 1);
          delete parentObj[id];
        } else if (parentExpression.type == 'ArrayExpression' && isArray) {
          parentExpression.elements.splice(arrayIndex, 1);
          index = arrayIndex;
          parentObj.splice(index, 1);
        }

        parentData.children.splice(index, 1);
        if (parentData.children.length == 0) {
          parentData.children = null;
        } else if (isArray) {
          parentData.children.forEach((json, index) => {
            json.id = `[${ [index] }]`;
            json.path = parentPath + json.id;
          });
        }
      } else {
        let { dataProperties, datas } = this;
        let index = dataProperties.findIndex(findByKeyName(id));
        dataProperties.splice(index, 1);
        datas.splice(index, 1);
        delVmData(this.vucInstance, id);
      }
    },

    getDataProperty(path) {
      let segments = toPath(path);
      let segment = segments.shift();
      let expr = this.dataProperties.find(findByKeyName(segment));
      while (( segment = segments.shift() ) !== undefined && expr) {
        if (expr.type == 'Property') {
          expr = expr.value;
        }
        if (expr.type == 'ObjectExpression') {
          expr = expr.properties.find(findByKeyName(segment));
        } else if (expr.type == 'ArrayExpression') {
          expr = expr.elements[segment];
        } else {
          expr = null;
        }
      }
      return expr;
    },

    getDataByPath(path) {
      let segments = toPath(path);
      let segment = segments.shift();
      let data = this.datas.find(data => data.id == segment);
      while (( segment = segments.shift() ) !== undefined && data) {
        if (data.children) {
          if (data.type == 'array') {
            data = data.children[segment];
          } else if (data.type == 'object') {
            data = data.children.find(data => data.id == segment);
          } else {
            data = null;
          }
        } else {
          data = null;
        }
      }
      return data;
    },
  });
}

function findByKeyName(name) {
  return (p) => getPropertyId(p) == name;
}

function setRootData(vm, key, value) {
//  vm.ROOT_PROXY_DATA[key] = value;
//  proxy(vm.$data, 'ROOT_PROXY_DATA', key);
  vm[key] = value;
}

function delVmData(vm, id) {
  vm[id] = undefined;
//  delete vm.ROOT_PROXY_DATA[id];
//  delete vm.$data[id];
//  delete vm[id];
}

//function proxy(target, sourceKey, key) {
//  let sharedPropertyDefinition = {
//    enumerable: true,
//    configurable: true,
//    get() {
//      return this[sourceKey][key];
//    },
//    set(val) {
//      this[sourceKey][key] = val;
//    },
//  };
//  Object.defineProperty(target, key, sharedPropertyDefinition);
//}

export { vucAstDataProcess };
