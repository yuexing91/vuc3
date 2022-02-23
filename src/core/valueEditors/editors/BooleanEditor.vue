<template>
  <Checkbox v-model:checked="val">
    {{ val ? trueText : falseText }}
  </Checkbox>
</template>
<script>
import { Checkbox } from 'ant-design-vue';

export default {
  components: {
    Checkbox,
  },
  props: {
    value: [String, Number, Boolean],
    trueValue: {
      type: [String, Number, Boolean],
      default: 'true',
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: 'false',
    },
    trueText: {
      type: String,
      default: '是',
    },
    falseText: {
      type: String,
      default: '否',
    },
    defaultValue: String,
  },
  emits: ['update:value'],
  data() {
    return {
      val: false,
    };
  },
  watch: {
    value: {
      handler(value) {
        value = value ?? this.defaultValue;
        this.val = value === this.trueValue;
      },
      immediate: true,
    },
    val() {
      this.$emit('update:value', this.val ? this.trueValue : this.falseValue);
    },
  },
  editorConfig: {
    id: 'boolean',
    dataType: 'boolean',
    name: '是否',
    validate(value) {
      return value === 'true' || value === 'false';
    },
  },
};
</script>
