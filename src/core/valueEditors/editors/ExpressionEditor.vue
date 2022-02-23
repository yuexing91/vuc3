<template>
  <code-editor v-model:value="val" @change="changeValue" :inline="inline"></code-editor>
</template>
<script>
import { CodeEditor } from '@/ui';

export default {
  components: {
    CodeEditor,
  },
  props: {
    value: String,
    inline: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:value'],
  data() {
    return {
      val: this.value,
    };
  },
  watch: {
    value() {
      this.val = this.value;
    },
  },
  methods: {
    changeValue() {
      if (this.val !== this.value) {
        this.$emit('update:value', this.val);
      }
    },
  },
  editorConfig: {
    id: 'expression',
    dataType: 'any',
    name: '表达式',
  },
};
</script>
