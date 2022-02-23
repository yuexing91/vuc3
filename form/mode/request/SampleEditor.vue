<template>
  <a-input-group compact>
    <a-select v-model:value="value.type" :options="expr_types" style="width: 90px"/>
    <div style="width: calc(100% - 95px)">
      <component :is="component" v-model:value="value.value" style="width: auto"/>
    </div>
  </a-input-group>
</template>

<script>
import { EXPR_TYPES } from './util';
import { toRefs } from 'vue';
import { CodeEditor } from '@';

let emptyValue = {};

export default {
  props: {
    value: {
      default: emptyValue,
    },
  },
  components: {},
  data() {
    return {
      expr_types: EXPR_TYPES,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val === emptyValue) {
          this.$emit('update:value', toRefs({}));
        }
      },
    },
  },
  computed: {
    component() {
      let t = {
        string: 'a-input',
        number: 'a-input-number',
        boolean: 'a-switch',
        expr: CodeEditor,
      };
      return t[this.value.type] || 'a-input';
    },
  },
};
</script>
