<template>
  <div class="vuc-explorer">
    <Collapse style="border: none;outline: none;" tabindex="999" v-model:active-key="activeKey">
      <CollapsePanel v-for="group in components" :header="group.title" :key="group.title">
        <div class="vuc-explorer-group">
          <span v-for="component in group.children"
                class="vuc-explorer-item"
                :class="{'vuc-explorer-item-selected':component===curSelected}"
                @dblclick="append(component)"
                @click="select(component)"
                @mousedown="dropStart($event,component)">
            <slot v-bind="component">
              {{ component.title }}
            </slot>
          </span>
        </div>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script>
import { Collapse, CollapsePanel } from 'ant-design-vue';
import designerMixins from '../designerMixins.js';
import { isFunction, isString } from '@/helpers/lang';
import { createVucNode } from '@/helpers/vucNodeHelper';

export default {
  mixins: [designerMixins],
  components: {
    Collapse, CollapsePanel,
  },
  props: {
    components: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      curSelected: null,
      activeKey: this.components.map(t => t.title),
    };
  },
  methods: {
    getV(component) {
      let data = Object.assign({}, component);
      let node = data.node;
      if (typeof node === 'string') {
        data.node = createVucNode(node);
      }
      return data;
    },

    dropStart(e, component) {
      this.activeEditor.dropStart(e, this.getV(component), {
        x: 0,
        y: 0,
        width: '100px',
        height: '30px',
      });
    },
    select(component) {
      this.curSelected = component;
    },
    append(component) {
      let curNode = this.activeEditor.currentNode || this.vucAst.rootNode;
      if (curNode || !this.vucAst.rootNode) {

        if (component.onDblclick) {
          return component.onDblclick(curNode);
        }

        let node = this.getV(component).node;

        if (isFunction(node)) {
          let call = node;
          node = call({ parentNode: curNode, dblClick: true });
        }

        if (isString(node)) {
          node = createVucNode(node);
        }

        if (node?.tag) {
          if (curNode) {
            if (node.tag === curNode.tag) {
              this.activeEditor.insertNode(curNode, 'after', node);
            } else {
              this.activeEditor.appendNode(curNode, node);
            }
          } else {
            this.vucAst.setRootNode(node);
            this.activeEditor.selectVucNode(node);
          }
        }
      }
    },
  },
};
</script>
<style lang="less">
.vuc-explorer {
  height: 100%;
  overflow: auto;

  &-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &-item {
    flex: 0 1 98px;
    display: inline-block;
    cursor: move;
    padding: 4px 6px;
    margin: 4px 0px;
    border: 1px solid #e1e1e1;

    &:hover {
      opacity: 0.8;
    }

    &-selected {
      background: #f0faff;
      color: #2d8cf0 !important;
    }
  }

}
</style>
