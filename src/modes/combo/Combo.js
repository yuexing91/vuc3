import { isFunction } from '@/helpers/lang';

class Combo {
  constructor(comboType, rootNode, nodeMap, nodeConfigMap) {
    this.comboType = comboType;
    this.rootNode = rootNode;
    this.nodeMap = nodeMap;
    this.nodeConfigMap = nodeConfigMap;
  }

  includeNode(vucNode) {
    return Object.values(this.nodeMap).includes(vucNode);
  }

  eachNodes(iterator) {
    Object.values(this.nodeMap).forEach((n) => iterator(n, n === this.rootNode));
  }

  getName() {
    return this.comboType.name;
  }

  getOptionConfigs() {
    if (isFunction(this.comboType.configs)) {
      return this.comboType.configs.call(this, this);
    }
    return this.comboType.configs;
  }

  getNode(key) {
    return this.nodeMap[key];
  }

  getNodeConfig(node) {
    return this.nodeConfigMap[node._astId];
  }

  onDragdrop(dropData, targetNode, pos) {
    if (this.comboType.onDragdrop) {
      return this.comboType.onDragdrop(dropData, targetNode, pos);
    }
  }
}

export default Combo;
