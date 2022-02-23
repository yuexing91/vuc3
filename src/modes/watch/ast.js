import { getFirstProperty, fn2json, updateProperty, getPropertyId } from '@/helpers/esprimaHelper.js';

import toPath from 'lodash-es/toPath';

function property2JSON(itemProperty) {
  let functionPrototype = itemProperty;
  let deep = false,
      immediate = false;

  if (functionPrototype.value.type === 'ObjectExpression') {
    functionPrototype.value.properties.forEach((p) => {
      let name = getPropertyId(p);
      if (name === 'handler') {
        functionPrototype = p.value;
      } else if (name === 'deep' && p.value.type === 'Literal') {
        deep = p.value.value;
      } else if (name === 'immediate' && p.value.type === 'Literal') {
        immediate = p.value.value;
      }
    });
  }

  let { name, params, remark, code } = fn2json(functionPrototype, code);
  name = name || remark;
  return {
    id: getPropertyId(itemProperty),
    name,
    params,
    deep,
    immediate,
    code,
  };
}

function vucAstWatchProcess(vucAst) {
  let watchProperty = vucAst.getExportProperty('watch', getFirstProperty('{watch:{}}'));
  let watchProperties = watchProperty.value.properties;
  let watchs = watchProperties.map(property2JSON);

  Object.assign(vucAst, {
    watchs,
    watchProperty,
    watchProperties,
    saveWatch(data, oldId) {
      oldId = oldId || data.id;
      let { watchs, watchProperties } = this;
      let property = getFirstProperty(toCode(data));
      let index = updateProperty(watchProperties, property, oldId);
      if (index != -1) {
        watchs.splice(index, 1, data);
      } else {
        watchs.push(data);
      }
      this._teardownWatch(oldId);
      this._watch(data);
    },

    delWatch(id) {
      let { watchs, watchProperties } = this;
      this._teardownWatch(id);
      let index = watchProperties.findIndex((p) => id == getPropertyId(p));
      watchProperties.splice(index, 1);
      watchs.splice(index, 1);
    },

    _watch(data) {
      let params = data.params.map((p) => p.id);
      let cb = new Function(...params, data.code);
      this.unwatchs[data.id] = this.vucInstance.$watch(data.id, cb, data);
    },

    _teardownWatch(id) {
      if (this.unwatchs[id]) {
        this.unwatchs[id]();
        delete this.unwatchs[id];
      }
    },
  });
}

function toCode(watch) {
  let comments = '';
  if (watch.name) {
    comments = `//${ watch.name }`;
  }

  let pName = toPath(watch.id).length > 1 ? `'${ watch.id }'` : watch.id;

  let handler = `(${ watch.params.map((p) => p.id).join(',') }){${ watch.code }}`;

  if (watch.immediate || watch.deep) {
    handler = 'handler' + handler;
    return `{
          ${ comments } 
          ${ pName }:{ 
            ${ watch.immediate ? 'immediate:true,' : '' }
            ${ watch.deep ? 'deep:true,' : '' }
            handler${ handler }
          }
        }`;
  }

  return `{${ comments }${ pName }${ handler }}`;
}



export { vucAstWatchProcess };
