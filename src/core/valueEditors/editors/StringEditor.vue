<template>
  <component :is="component"
             v-model:value="val"
             allowClear
             style="width: 100%"
             :options="completeOptions"
             @blur="changeValue"
             @select="changeValue"
             @pressEnter="blur"
             @search="onSearch" spellcheck="false"/>
</template>
<script>
import { AutoComplete, Input } from 'ant-design-vue';
import { isStringType } from '@/helpers/codeType';

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    items: [Array, Function],
  },
  emits: ['update:value'],
  data() {
    return {
      val: null,
      options: [],
    };
  },
  computed: {
    component() {
      return this.items ? AutoComplete : Input;
    },
    completeOptions() {
      if (Array.isArray(this.items)) {
        return this.items;
      }
      return this.options;
    },
  },
  watch: {
    value: {
      handler() {
        this.val = this.value.substring(1, this.value.length - 1);
      },
      immediate: true,
    },
  },
  methods: {
    blur() {
      let input = this.$el.querySelector('input') || this.$el;
      input.blur();
    },
    changeValue() {
      if (this.val === this.value) {
        return;
      }
      let v = `'${ this.val }'`;
      if (v !== this.value) {
        this.$emit('update:value', v);
      }
    },
    onSearch(val) {
      if (typeof this.items == 'function') {
        this.options = this.items.call(null, val);
      }
    },
  },
  editorConfig: {
    id: 'string',
    name: '字符串',
    dataType: 'string',
    validate(value) {
      return isStringType(value);
    },
  },
};
</script>
