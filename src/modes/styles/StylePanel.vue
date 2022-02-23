<template>
  <div class="vuc-mode-view" v-if="vucNode">
    <div class="vuc-style-inline">
      <div @click="addItem()">内联样式 {</div>
      <style-item
          v-for="(style, index) in styles"
          :item="style"
          :editType="getEditType(style)"
          @editover="editover"
          @enter-value="editNext"
          @click="addItem(index)"
          :key="style.id"
      />
      <div @click="addItem()">}</div>
    </div>
  </div>
</template>

<script>
import StyleItem from './StyleItem';
import nodeMixins from '../nodeMixins';

import { newStyle, parseStyleStr, styleToStr } from './styleUtil';

export default {
  components: { StyleItem },
  mixins: [nodeMixins],
  data() {
    return {
      curEvent: {},
      editState: false,
      styles: [],
      currentItem: undefined,
      styleStr: '',
    };
  },
  computed: {
    styleRawStr() {
      if (!this.vucNode) return;
      let bind = this.vucNode.getStaticBind('style');
      return bind && bind.attrValue;
    },
  },
  watch: {
    styleRawStr: {
      handler(styleRawStr) {
        if (this.styleStr != styleRawStr) {
          this.styleStr = styleRawStr;
          this.styles = parseStyleStr(styleRawStr);
        }
      },
      immediate: true,
    },
  },
  methods: {
    editover(item, type) {
      if (this.vucNode) {
        let kState = item.k.trim().length === 0;
        let vState = item.v.trim().length === 0;
        if (kState || ( type == 'value' && vState )) {
          let index = this.styles.indexOf(item);
          if (index > -1) {
            this.styles.splice(index, 1);
          }
        }
        let style = styleToStr(this.styles);
        if (this.styleStr != style) {
          this.styleStr = style;
          this.vucNode.setStyle(style);
        }
      }
      this.currentItem = undefined;
    },

    editNext(item) {
      this.$nextTick(() => {
        if (item === this.styles[this.styles.length - 1]) {
          this.addItem();
        } else {
          this.currentItem = this.styles[this.styles.indexOf(item) + 1];
        }
      });
    },

    addItem(index) {
      if (!this.vucNode) return;
      this.currentItem = newStyle();

      if (index === undefined) {
        this.styles.push(this.currentItem);
      } else {
        this.styles.splice(index + 1, 0, this.currentItem);
      }
    },

    getEditType(style) {
      return this.currentItem?.id === style.id ? 'key' : undefined;
    },
  },
};
</script>
