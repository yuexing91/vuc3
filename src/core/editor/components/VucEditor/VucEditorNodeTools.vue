<template>
  <div v-show="isShow" class="vuc-tag-tools" :style="navPosStyle"
       style="width: 30px;">
    <Button @mousedown.left="dropStart" size="small" title="移动">
      <DragOutlined #icon/>
    </Button>
    <Button
        size="small"
        v-for="(btn,index) in buttons"
        :title="btn.title"
        :key="index"
        @click="handlerClick($event,btn)">
      <component :is="btn.icon" #icon></component>
    </Button>
  </div>
</template>

<script>
import { Button } from 'ant-design-vue';
import DragOutlined from '@ant-design/icons-vue/DragOutlined';

const buttons = [
  /*{
    icon: 'RollbackOutlined',
    title: '选中父级容器',
    handler: 'selectParent',
  },
  {
    icon: 'VerticalAlignTopOutlined',
    title: '前移',
    handler: 'moveToBefore',
  },
  {
    icon: 'VerticalAlignBottomOutlined',
    title: '后移',
    handler: 'moveToAfter',
  },
  {
    icon: 'DeleteOutlined',
    title: '删除',
    handler: 'remove',
  },*/
];

export default {
  data() {
    return {
      navPos: {
        top: 0,
        left: -100,
      },
    };
  },
  components: {
    DragOutlined,
    Button
  },
  computed: {
    currentNode() {
      return this.$parent.currentNode;
    },
    isShow() {
      return this.currentNode && this.currentNode.parent;
    },
    navPosStyle() {
      return {
        top: this.navPos.top - this.$parent.scrollTop + 'px',
        left: this.navPos.left - this.$parent.scrollLeft + 'px',
      };
    },
    buttons() {
      if (this.currentNode) {
        let tools = this.currentNode.getConfig('editorTools') || [];
        return buttons.concat(tools);
      }
    },
  },
  created() {
    this._intervalId = setInterval(() => {
      this.updatePos();
    }, 1000 / 60);
  },
  unmounted() {
    clearInterval(this._intervalId);
  },
  watch: {
    currentNode() {
      this.$nextTick(() => {
        this.updatePos();
      });
    },
  },
  methods: {
    updatePos() {
      let vuc = this.currentNode;
      if (vuc) {
        let rootRect = this.$parent.$el.querySelector('.vuc-ceditor').getBoundingClientRect();
        let el = this.$parent.currentSelectElement || this.$parent.getVucNodeElement(vuc);
//        let el = this.$parent.getVucNodeElement(vuc);

        if (el) {
          let rect = el.getBoundingClientRect();
          this.navPos = {
            top: rect.top - rootRect.top - 1 + this.$parent.scrollTop,
            left: rect.right - rootRect.left + 1 + this.$parent.scrollLeft,
          };
          let width = this.$parent.$el.querySelector('.vuc-app-wrapper').scrollWidth;
          this.navPos.left = Math.min(this.navPos.left, width - 10);

          // el.focus();

          return;
        }
      }

    },

    handlerClick(e, btn) {
      if (typeof btn.handler == 'string') {
        this[btn.handler](e);
      } else {
        btn.handler.call(null, e, this.currentNode);
      }
    },

    dropStart(e) {
      let vucNode = this.currentNode;
      let el = this.$parent.getVucNodeElement(vucNode);
      let rect = el.getBoundingClientRect();

      this.$parent.dropStart(e, {
        node: vucNode,
        tag: vucNode.tag,
      }, {
        x: 0,
        y: 0,
        width: rect.width + 'px',
        height: rect.height + 'px',
      });
    },

    moveToBefore() {
      this.$parent.moveToBefore(this.currentNode);
    },

    moveToAfter() {
      this.$parent.moveToAfter(this.currentNode);
    },

    remove() {
      this.$parent.removeNode(this.currentNode);
    },

    selectParent() {
      let vucNode = this.currentNode;
      if (vucNode.parent) {
        this.$parent.selectVucNode(vucNode.parent);
      }
    },
  },
};
</script>
<style lang="less">
.vuc-tag-tools {
  /*border: 1px solid #d9d9d9;*/

  .ant-btn {
    border-top: 0;
    border-radius: 0;

    &:first-child {
      border-top: 1px solid #d9d9d9;
      border-radius: 2px 2px 0 0;
    }

    &:last-child {
      border-radius: 0 0 2px 2px;
    }
  }
}
</style>
