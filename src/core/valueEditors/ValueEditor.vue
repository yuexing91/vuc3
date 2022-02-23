<template>
  <component :is="editorComponent" v-bind="$attrs" v-model:value="val"/>
</template>

<script>
import { getEditorComponent } from './config';

export default {
  emits: ['update:value'],

  inheritAttrs: false,

  props: {
    editor: String,
    value: [String, Number, Boolean],
  },

  computed: {
    editorComponent() {
      return getEditorComponent(this.editor);
    },
  },

  data() {
    return {
      val: this.value,
    };
  },

  watch: {
    value() {
      this.val = this.value;
    },
    val() {
      if (this.val !== this.value) {
        this.$emit('update:value', this.val);
      }
    },
  },

};
</script>
