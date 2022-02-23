<template>
  <TableEditor :columns="argsOption" v-model:value="value" rowKey="id" size="small" bordered></TableEditor>
</template>

<script>
import { TableEditor } from '@';
import { EXPR_TYPES } from './util';

export default {
  emits: ['update:value'],
  props: {
    value: Array,
  },
  components: {
    TableEditor,
  },
  watch: {
    value() {
      this.$emit('update:value', this.value);
    },
  },
  data() {
    return {
      argsOption: [
        {
          title: '参数名',
          field: 'id',
          width: 140,
        },
        {
          title: '参数类型',
          field: 'type',
          width: 100,
          editor: 'select',
          editorProps: {
            options: EXPR_TYPES,
          },
        },
        {
          title: '参数值',
          field: 'value',
          editor(record) {
            return record.type;
          },
        },
        {
          title: '备注',
          field: 'name',
          width: 100,
        },
      ],
    };
  },
};
</script>
