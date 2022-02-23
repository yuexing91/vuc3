import { getFirstProperty, fn2json, updateProperty, getPropertyId } from '@/helpers/esprimaHelper.js';

function property2JSON(property) {
  return fn2json(property);
}

export function vucAstMethodProcess(vucAst) {
  let methodProperty = vucAst.getExportProperty('methods', getFirstProperty('{ methods: { } }'));
  let methodProperties = methodProperty.value.properties;
  let methods = methodProperties.map(property2JSON);

  Object.assign(vucAst, {
    methods,
    methodProperty,
    methodProperties,
    saveMethod(method, oldId) {
      oldId = oldId || method.id;
      let { methods, methodProperties } = this;

      let params = getParamStr(method.params);
      let comment = getComment(method);
      let property = getFirstProperty(`{ ${ comment } ${ method.id }(${ params }) { ${ method.code } } }`);

      let index = updateProperty(methodProperties, property, oldId);
      if (index != -1) {
        methods.splice(index, 1, method);
        delete this.vucInstance[oldId];
      } else {
        methods.push(method);
      }

      this.vucInstance[method.id] = vucAst.createFunction(getParamStr(method.params), method.code, this.vucInstance);
//      this.vucInstance[method.id] = methodToFunction(method, this.vucInstance);
      this.vucInstance.$forceUpdate();
    },

    delMethod(id) {
      let { methods, methodProperties } = this;
      let index = methodProperties.findIndex((p) => id == getPropertyId(p));
      methodProperties.splice(index, 1);
      methods.splice(index, 1);
      delete this.vucInstance[id];
      this.vucInstance.$forceUpdate();
    },
  });
}

function methodToFunction(method, context) {
  return new Function(getParamStr(method.params), method.code).bind(context);
}

function getComment(method) {
  let comments = [];

  if (method.name) {
    comments.push(`* @name ${ method.name }`);
  }

  method.annotations?.forEach(a => {
    comments.push(`* ${ a.name } ${ a.params }`);
  });

  if (method.remark) {
    comments.push(method.remark);
  }

  comments = comments.concat(
      method.params.map((param) => {
        let id = param.req ? `[${ param.id }]` : param.id;
        return `* @param ${ id } ${ param.desc || '' }`;
      }),
  );

  if (comments.length) {
    return `/**\n${ comments.join('\n') } \n*/`;
  }
  return '';
}

function getParamStr(params) {
  return params.map((p) => p.id).join(',');
}
