import { computed, watch } from 'vue';
import { createCombo } from './config';
import Configurator from '../../config';

Configurator.registerAstProcess(function (vucAst) {
  function loop(node) {
    let combo = createCombo(node);
    if (combo) {
      vucAst.combos.push(combo);
    } else if (node.children) {
      node.children.forEach(loop);
    }
  }

  vucAst.combos = [];
  vucAst.maybeCombo = function (vucNode) {
    return vucAst.combos.find((combo) => combo.rootNode === vucNode);
  };

  let vucRootNode = computed(() => vucAst.rootNode);
  watch(
      vucRootNode,
      () => {
        vucAst.combos = [];
        if (vucAst.rootNode) {
          loop(vucAst.rootNode);
        }
      },
      {
        deep: true,
        immediate: true,
      },
  );
});

Configurator.setVucEditorHooks({
  onBeforeSelectNode(vucNode) {
    let flag = true;
    for(let combo of vucNode.vucAst.combos) {
      if (combo.includeNode(vucNode)) {
        if (vucNode === combo.rootNode) {
          return true;
        }
        flag = false;
      }
    }
    return flag;
  },
  onDragdrop(dropData, targetNode, pos) {
    for(let combo of targetNode.vucAst.combos) {
      if (combo.includeNode(targetNode)) {
        //拖到根节点的外层
        if (targetNode === combo.rootNode && pos != 'inner') {
          return true;
        }

        if (pos === 'inner') {
          let config = combo.getNodeConfig(targetNode);
          if (config && config.dragover) {
            return;
          }
        }

        if (combo.onDragdrop(dropData, targetNode, pos)) {
          return;
        }

        return false;
      }
    }
  },
});

Configurator.setVucProxyHooks({
  onBeforeRender(context) {
    context.vucAst.combos.forEach((combo) => {
      combo.eachNodes((node, isRoot) => {
        if (!isRoot) {
          let config = combo.getNodeConfig(node);
          if (config.dragover) {
            return;
          }
          if (context.cancelOutline) {
            context.cancelOutline(node);
          }
        }
      });
    });
  },
});
