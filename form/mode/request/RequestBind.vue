<template>
  <TableEditor :columns="argsOption" v-model:value="value" rowKey="id" size="small" bordered></TableEditor>
</template>

<script>
import { TableEditor } from '@';
import { TreeSelect } from 'ant-design-vue';

import { computed } from 'vue';

export default {
  inject: ['$designer'],
  props: {
    resultId: String,
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
    function loop(arr) {
      return arr.map(item => {
        let it = Object.assign({}, item);
        if (item.children) {
          it.children = loop(item.children);
        }
        it.relPath = `this.${ it.path }`;
        return it;
      });
    }

    return {
      argsOption: [
        {
          title: '变量',
          field: 'path',
          width: 100,
          editor: TreeSelect,
          editorProps: {
            treeData: loop(this.$designer.editor.vucAst.datas),
            replaceFields: { title: 'id', key: 'relPath', value: 'relPath' },
            treeNodeLabelProp: 'relPath',
          },
          validate(val) {
            return val ? '' : '变量必填';
          },
        },
        {
          title: '结果表达式',
          field: 'value',
          editorProps: computed(() => {
            return {
              class: 'req-bind-val',
              prefix: this.resultId,
            };
          }),
          width: 100,
          formatter: (val) => {
            return this.resultId + val;
          },
        },
      ],
    };
  },
};
</script>
