<template>
  <TableEditor :columns="argsOption" v-model:value="value" rowKey="id" size="small" bordered></TableEditor>
</template>

<script>
import TableEditor from '../TableEditor';
import { isIdentifier } from '@/helpers/lang';

export default {
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
          validate(value) {
            return isIdentifier(value) ? '' : `${ value }不符合javascript标识符规则`;
          },
        },
        {
          title: '说明',
          field: 'desc',
        },
        {
          title: '是否必填',
          field: 'req',
          width: 100,
          editor: 'boolean',
        },
      ],
    };
  },
};
</script>
