export default {
  data() {
    return {
      curCopyNode: null,
      copyOrCut: null,
    };
  },

  methods: {
    copyNode(node) {
      this.curCopyNode = node;
      this.copyOrCut = 'copy';
    },

    cutNode(node) {
      this.curCopyNode = node;
      this.copyOrCut = 'cut';
    },

    parseNode(node, pos, _node) {
      if (!_node) {
        if (this.copyOrCut == 'copy') {
          _node = this.curCopyNode.clone();
        } else {
          _node = this.curCopyNode;
        }
      }

      this.insertNode(node, pos, _node);
      if (this.copyOrCut === 'cut' && _node === this.curCopyNode) {
        this.curCopyNode = null;
      }
    },

    insertNode(node, pos, _node, notChangeSlot) {
      if (!_node) return;

      if (!notChangeSlot) {
        if (node.getSlotName()) {
          node.parent.insertToSlot(_node, node.getSlotName());
        } else if (_node.getSlotName()) {
          _node.delSlot();
        }
      }
      if (pos === 'before') {
        node.insertBefore(_node);
      } else {
        node.insertAfter(_node);
      }
      this.selectVucNode(_node);
    },

    insertToSlot(node, slotName, _node) {
      if (!_node) {
        if (this.copyOrCut == 'copy') {
          _node = this.curCopyNode.clone();
        } else {
          _node = this.curCopyNode;
        }
      }

      if (_node) {
        node.insertToSlot(_node, slotName || 'default');
        this.selectVucNode(_node);
        if (this.copyOrCut === 'cut' && _node === this.curCopyNode) {
          this.curCopyNode = null;
        }
      }
    },

    repeatNode(node) {
      const cloneNode = node.clone();
      node.insertAfter(cloneNode);
      this.selectVucNode(cloneNode);
    },

    moveToBefore(node) {
      node.moveToBefore();
      this.selectVucNode(node);
    },

    moveToAfter(node) {
      node.moveToAfter();
      this.selectVucNode(node);
    },

    moveToSlot(node, slotName) {
      node.moveToSlot(slotName);
      this.selectVucNode(node);
    },

    appendNode(node, dropNode) {
      node.appendNode(dropNode);
      this.selectVucNode(dropNode);
    },

    removeNode(node) {
      if (node.vucAst.rootNode == node) {
        node.vucAst.setRootNode(null);
        this.clearSelected();
      } else {
        let n = node;
        if (node.parent?.tag === 'template' && node.parent.children.length === 1) {
          n = node.parent;
        }
        let t = n.getAfterNode() || n.getBeforeNode() || n.parent;
        n.remove();
        this.selectVucNode(t);
      }
    },
  },
};
