<template>
  <RadioGroup :options="items" v-model:value="val"/>
</template>
<script>
import { RadioGroup } from 'ant-design-vue';
import { getStringValue } from '../util';

export default {
  components: {
    RadioGroup,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    items: Array,
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
        this.val = this.value.substring(1, this.value.length - 1);
      },
      immediate: true,
    },
    val() {
      let v = `'${ this.val }'`;
      if (v !== this.value) {
        this.$emit('update:value', v);
      }
    },
  },
  editorConfig: {
    id: 'radio-group',
    dataType: 'string',
    name: '选项',
    validate(value, props) {
      if (props?.items) {
        value = getStringValue(value);
        return props.items.find(it => it.value == value) ? true : false;
      }
    },
  },
};
</script>
