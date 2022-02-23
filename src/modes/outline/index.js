import Configurator from '@/config';

let noOutlineNodeMap = {};

Configurator.setVucProxyHooks({
  onBeforeRender(context) {
    noOutlineNodeMap = {};
    context.cancelOutline = function (node) {
      noOutlineNodeMap[node._astId] = true;
    };
  },

  onRender({ node, attrMap }) {
    if (noOutlineNodeMap[node._astId]) {
      attrMap['no-outline'] = '';
    }
  },
});
