<template>
  <div class="vuc-structure" :class="cls">
    <template v-if="openState">
      <div class="vuc-structure-header">
        元素
        <ExpandAltOutlined @click="toggleState" class="vuc-structure-header-extra"/>
      </div>

      <div class="vuc-structure-body">
        <Tree :selectedKeys="selectedKeys" :tree-data="ast" :replaceFields="{ key: '_astId' }">
          <template #title="{ _astId }">
            <vue-node :node="getVucNode(_astId)"></vue-node>
          </template>
        </Tree>
        <context-menu
            v-model:show="showMenu"
            :items="contenxtMenuItems"
            :style="contextMenuStyle"
            @click-item="handleMenu"
        ></context-menu>
      </div>
    </template>

    <Tooltip v-else title="显示页面结构">
      <ExpandOutlined style="color: #fff" @click="toggleState"/>
    </Tooltip>
  </div>
</template>
<script>
import { Tooltip, Tree } from 'ant-design-vue';
import ExpandAltOutlined from '@ant-design/icons-vue/ExpandAltOutlined';
import ExpandOutlined from '@ant-design/icons-vue/ExpandOutlined';

import VueNode from './VueNode.vue';

import dropMixin from './structureDrop';
import { createMenus } from '../../contextMenus';
import { ContextMenu } from '@/ui';

export default {
  components: {
    VueNode,
    ContextMenu,
    ExpandAltOutlined,
    ExpandOutlined,
    Tree,
    Tooltip,
  },

  provide() {
    return {
      $Structure: this,
    };
  },
  mixins: [dropMixin],

  data() {
    return {
      showMenu: false,
      contextMenuStyle: {},
      openState: true,
      contenxtMenuItems: [],
    };
  },

  computed: {
    vucAst() {
      return this.editor.vucAst;
    },
    curVucNode() {
      return this.editor.currentNode;
    },

    selectedKeys() {
      return this.curVucNode ? [this.curVucNode._astId] : [];
    },

    cls() {
      return this.openState ? '' : 'vuc-structure-close';
    },

    ast() {
      if (this.vucAst?.rootNode) {
        return [this.vucAst.rootNode];
      }
    },

    editor() {
      return this.$parent;
    },
  },

  methods: {
    toggleState() {
      this.openState = !this.openState;
    },

    getVucNode(id) {
      return this.editor.getVucNode(id);
    },

    selectNode(node) {
      if (this.curVucNode === node) {
        return;
      }
      this.editor.selectVucNode(node);
    },

    handleMenu(item) {
      item.handler(this.curVucNode, this.editor);
    },

    showContextMenu(e, node) {
      this.selectNode(node);
      const rect = this.$el.getBoundingClientRect();
      this.showMenu = true;
      this.contextMenuStyle = {
        top: e.pageY - rect.y + 'px',
        left: e.pageX - rect.x + 'px',
      };
      this.contenxtMenuItems = createMenus(this.editor);
    },
  },
};
</script>

<style lang="less">
.vuc-structure {
  position: relative;
  border-left: 1px solid #e8eaec;

  .ant-tree li {
    padding-top: 0 !important;
  }

  .ant-tree-node-content-wrapper {
    height: auto !important;
  }

  &.vuc-structure-close {
    position: absolute;
    width: 22px !important;
    height: 22px !important;
    background: #2d8cf0;
    top: 2px;
    right: 0px;
    border-radius: 50%;
    text-align: center;

    a {
      color: #fff;

      :hover {
        opacity: 0.8;
      }
    }
  }

  .vuc-structure-header {
    position: relative;
    padding: 4px 8px;
    color: #2d8cf0;
    border-bottom: 1px solid #e8eaec;
  }

  .vuc-structure-header-extra {
    position: absolute;
    font-size: 16px;
    right: 2px;
    top: 8px;
  }

  .vuc-structure-body {
    height: ~'calc(100% - 30px)';
    overflow: auto;
  }
}

.vuc-structure-pos-proxy {
  position: absolute;
  height: 0px;
  border-top: 2px dashed red;
  pointer-events: none;
}

.vuc-structure-pos-proxy-inner {
  background: transparent;
  border: 2px dashed red;
}
</style>
