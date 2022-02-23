<template>
  <Input v-model:value="inputValue[type]" @blur="onChange">
    <template #addonBefore>
      <Select v-model:value="type" style="width: 100px" @change="onChange">
        <Select-option value="col">栅格(col)</Select-option>
        <Select-option value="flex">弹性(flex)</Select-option>
      </Select>
    </template>
  </Input>
</template>

<script>
import { Input, Select, SelectOption } from 'ant-design-vue';

export default {
  inject: ['$designer'],
  emits: 'update:value',
  components: {
    Input, Select, SelectOption,
  },
  props: {
    value: String,
  },
  data() {
    return {
      inputValue: {},
      type: 'col',
    };
  },

  watch: {
    value: {
      handler(v) {
        if (!v) return;
        try {
          let col = eval(`( ${ v } )`);
          if (col.span) {
            this.type = 'col';
            this.inputValue.col = col.span;
          } else if (col.flex) {
            this.type = 'flex';
            this.inputValue.flex = col.flex;
          }
        } catch (e) {
          console.log(e);
        }
      },
      immediate: true,
    },
  },

  methods: {
    onChange() {
      let v = '';
      if (this.inputValue[this.type]) {
        if (this.type == 'flex') {
          let flex = isNumber(this.inputValue.flex) ? this.inputValue.flex : `'${ this.inputValue.flex }'`;
          v = `{ flex: ${ flex } }`;
        } else if (this.type == 'col') {
          v = `{ span: ${ this.inputValue.col } }`;
        }
      }
      this.$emit('update:value', v);
    },
  },

  editorConfig: {
    id: 'col',
    dataType: 'object',
    name: '栅格',
  },
};

function isNumber(str) {
  return /^\-?[0-9]+\.?[0-9]*$/.test(str);
}

</script>
