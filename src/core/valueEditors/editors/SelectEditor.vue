<template>
  <Select v-model:value="val" style="width: 100%" :options="items" allowClear/>
</template>
<script>
import { Select } from 'ant-design-vue';
import { getStringValue } from '../util';

export default {
  components: {
    Select,
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
      let v = this.val === undefined ? '' : `'${ this.val }'`;
      if (v !== this.value) {
        this.$emit('update:value', v);
      }
    },
  },
  editorConfig: {
    id: 'select',
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
