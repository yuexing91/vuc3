<template>
  <Item class="vuc-qstyle-item" :title="name">
    <Input v-model:value="value" @blur="saveVaule" @keydown.enter="blur" allowClear/>
  </Item>
</template>

<script>
import { Input } from 'ant-design-vue';
import { Item } from '@/ui';
import { parseStyleStr, styleToStr } from './styleUtil';

export default {
  components: {
    Item, Input,
  },
  props: {
    id: String,
    name: String,
    vucNode: Object,
  },

  data() {
    return {
      value: '',
    };
  },

  computed: {
    styles() {
      let bind = this.vucNode.getStaticBind('style');
      return parseStyleStr(bind && bind.attrValue);
    },
    style() {
      return this.styles.find(style => style.k == this.id && style.comment);
    },
  },

  watch: {
    style(style) {
      if (style) {
        this.value = style.v;
      }
    },
  },

  methods: {
    saveVaule() {
      if (this.value) {
        if (this.style) {
          this.style.v = this.value;
        } else {
          this.styles.push({
            k: this.id,
            v: this.value,
            comment: true,
          });
        }
      } else if (this.style) {
        let index = this.styles.indexOf(this.style);
        this.styles.splice(index, 1);
      }

      let style = styleToStr(this.styles);
      this.vucNode.setStyle(style);
    },

    blur() {
      this.$el.querySelector('input').blur();
    },
  },
};
</script>
