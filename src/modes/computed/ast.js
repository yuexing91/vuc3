import { computed } from 'vue';
import {
  getFirstProperty,
  extractAnnotations,
  genFunBodyCode,
  updateProperty,
  getPropertyId,
} from '@/helpers/esprimaHelper.js';

function property2JSON(property) {
  let Annotations = extractAnnotations(property.leadingComments);
  let code = genFunBodyCode(property.value);
  return {
    id: getPropertyId(property),
    name: Annotations.remark(),
    code: code,
  };
}

function vucAstComputedProcess(vucAst) {
  let computedProperty = vucAst.getExportProperty('computed', getFirstProperty('{computed:{}}'));
  let computedProperties = computedProperty.value.properties;
  let computeds = computedProperties.map(property2JSON);

  Object.assign(vucAst, {
    computeds,
    computedProperty,
    computedProperties,
    saveComputed(data, oldId) {
      oldId = oldId || data.id;
      let { computeds, computedProperties } = this;
      let vm = this.vucInstance;

      let property = getFirstProperty(`{ /*${data.name}*/ ${data.id} : function(){ ${data.code} } }`);
      let index = updateProperty(computedProperties, property, oldId);
      if (index != -1) {
        computeds.splice(index, 1, data);
        delVmComputed(vm, oldId);
      } else {
        computeds.push(data);
      }
      createComputed(vm, data);
      vm.$forceUpdate();
    },

    delComputed(id) {
      let { computeds, computedProperties } = this;
      let vm = this.vucInstance;
      let index = computedProperties.findIndex((p) => id == getPropertyId(p));
      computedProperties.splice(index, 1);
      computeds.splice(index, 1);
      delVmComputed(vm, data.id);
      vm.$forceUpdate();
    },
  });
}

function delVmComputed(vm, id) {
  delete vm.$.ctx[id];
}

function noop() {}

function createComputed(vm, data) {
  let get = new Function(data.code);

  get = get.bind(vm, vm);

  const c = computed({
    get,
    set: noop,
  });

  Object.defineProperty(vm.$.ctx, data.id, {
    enumerable: true,
    configurable: true,
    get: () => c.value,
    set: (v) => (c.value = v),
  });

  // TODO 需要考虑unmounts时怎么卸载
}

export { vucAstComputedProcess };
