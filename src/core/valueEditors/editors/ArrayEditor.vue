<template>
  <table-editor
      block
      size="small"
      button-text="新增一项"
      :isTreeData="isTreeData"
      :rowKey="keyName"
      :columns="columns"
      :value="array"
      @change="changeValue"
  />
</template>
<script>
import { TableEditor } from '@/ui';
import { jsonObjToCode } from '@/helpers/esprimaHelper';
import { isArrayType } from '@/helpers/codeType';

export default {
  components: {
    TableEditor,
  },
  props: {
    isTreeData: Boolean,
    value: String,
    fields: Array,
    type: {
      type: String,
      default: 'object',
    },
    keyName: {
      type: String,
      default: 'id',
    },
  },
  inject: ['$designer'],
  emits: ['update:value'],
  data() {
    return {
      array: [],
      val: undefined,
    };
  },
  computed: {
    columns() {
      if (this.type !== 'object') {
        return [{ title: '选项', field: this.keyName, type: this.type }];
      }

      return this.fields.map((field) => {
        return {
          title: field.label,
          field: field.name,
          editor: field.type,
          width: field.type == 'boolean' ? 50 : null,
        };
      });
    },
  },
  watch: {
    value: {
      handler() {
        if (this.val == this.value) {
          return;
        }
        if (this.value) {
          try {
            let array = new Function(`return ${ this.value }`).call();
            if (this.type !== 'object') {
              this.array = array.map(t => {
                return { [this.keyName]: t };
              });
            } else {
              this.array = array;
            }
          } catch (e) {
            console.error(e);
          }
          this.val = this.getFormatCode();
        }

        if (!this.array) {
          this.array = [];
        }
      },
      immediate: true,
    },
  },
  methods: {
    changeValue() {
      this.val = this.getFormatCode();

      this.$emit('update:value', this.val);
    },
    getFormatCode() {
      let array = this.array;
      if (this.type !== 'object') {
        array = array.map(t => t[this.keyName]);
      }
      return jsonObjToCode(array);
    },
  },
  editorConfig: {
    id: 'array',
    dataType: 'object',
    name: '数组',
    validate(value) {
      return isArrayType(value);
    },
  },
};
</script>
