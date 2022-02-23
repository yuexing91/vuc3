import {
  getFirstProperty,
  fn2json,
  astToCode,
  updateProperty,
} from '@/helpers/esprimaHelper.js';
import { computed, watch } from 'vue';

function property2JSON(property) {
  return fn2json(property);
}

export function vucAstHooksProcess(vucAst) {

  let hookPropertis = computed(() => {
    return ['beforeCreate', 'created', 'beforeMount', 'mounted'].map(name => vucAst.getExportProperty(name)).filter(t => t);
  });

  watch(hookPropertis, () => {
    vucAst.hooks = hookPropertis.value.map(property2JSON);
  }, { immediate: true });

  vucAst.updateHookBody = function (hook, bodyCode) {
    let property = getFirstProperty(`{ ${ hook }() { ${ bodyCode } } }`);
    updateProperty(vucAst.exportDefault.declaration.properties, property, hook);
  };

  vucAst.getHookBody = function (hook) {
    let property = vucAst.getExportProperty(hook);
    return property?.value.body.body;
  };

}
