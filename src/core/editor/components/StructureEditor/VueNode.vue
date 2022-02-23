<template>
  <span class="vue-node" @click="selectNode" @contextmenu.stop.prevent="showMenu" @mousedown.stop="dropStart">
    <template v-if="!isText">
      <span class="vue-node-tag" @mousemove="dropMove" @mouseup="dropUp">{{ node.rawTag }}</span>
      <span class="vue-node-attrs" v-if="attrs.length">
        <span
          class="vue-node-attr"
          v-for="(attr, index) in attrs"
          :style="index > 0 ? marginLeft : null"
          :key="attr.name"
        >
          <span class="vue-node-property">{{ attr.attrName }}</span>
          <template v-if="attr.attrValue !== null">
            <span class="vue-node-operator">=</span>
            <span class="vue-node-string">{{ attr.attrValue }}</span>
          </template>
        </span>
      </span>
    </template>
    <template v-else>
      <span class="vue-node-str" @mousemove="dropMove" @mouseup="dropUp">{{ node.getText() }}</span>
    </template>
  </span>
</template>
<script>
export default {
  props: {
    node: Object,
  },
  inject: ['$Structure'],
  computed: {
    isText() {
      return this.node.isText();
    },
    marginLeft() {
      //        return `margin-left:${ ( ( this.node.tag.length ) * 7.7 + 9 ) }px`;
    },
    attrs() {
      return this.node.props;
    },
  },
  data() {
    return {};
  },
  methods: {
    selectNode() {
      this.$Structure.selectNode(this.node);
    },
    dropStart(e) {
      this.$Structure.dropStart(e, {
        node: this.node,
        tag: this.node.tag,
      });
    },
    dropMove(e) {
      this.$Structure.dropMove(e, this.node);
    },
    dropUp(e) {
      this.$Structure.dropUp(e, this.node);
    },
    showMenu(e) {
      this.$Structure.showContextMenu(e, this.node);
    },
  },
};
</script>

<style lang="less">
.vue-node {
  font: 14px / normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;
  cursor: pointer;
  user-select: none;

  &.vue-node-selected {
    .vue-node-tag,
    .vue-node-attr,
    .vue-node-str {
      background: #fffae3;
    }
  }

  &-tag {
    line-height: 20px;
    height: 20px;
    margin-right: -8px;
    padding-right: 8px;
    display: inline-block;
  }

  &-property {
    color: #00c;
  }

  &-string {
    color: #a11;

    &:before,
    &:after {
      content: '"';
    }
  }

  &-operator {
  }

  &-attr {
    line-height: 20px;
    height: 20px;
    //display: block;
    padding-right: 8px;

    &:first-child {
      display: inline-block;
      margin-left: 8px;
    }
  }
}
</style>
