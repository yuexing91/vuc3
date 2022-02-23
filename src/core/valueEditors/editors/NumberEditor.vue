<template>
  <InputNumber :max="max" :min="min" v-model:value="val" style="width: 100%"/>
</template>
<script>
import { InputNumber } from 'ant-design-vue';

import { isNumberType } from '@/helpers/codeType';

export default {
  components: {
    InputNumber,
  },
  props: {
    value: [Number, String],
    max: {
      type: Number,
    },
    min: {
      type: Number,
    },
  },
  emits: ['update:value'],
  data() {
    return {
      val: null,
    };
  },
  watch: {
    value: {
      handler() {
        this.val = isNumberType(this.value) ? parseFloat(this.value) : null;
      },
      immediate: true,
    },
    val() {
      this.$emit('update:value', typeof this.val == 'number' ? this.val.toString() : '');
    },
  },
  editorConfig: {
    id: 'number',
    dataType: 'number',
    name: '数字',
    validate(value) {
      return isNumberType(value);
    },
  },
};
</script>
