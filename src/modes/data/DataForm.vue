<template>
  <Form :labelCol="{ flex: '100px'  }" :wrapperCol="{ flex: 1 }" :model="vucData" :rules="ruleValidate">
    <FormItem label="标识" v-if="!isArraySub" name="id">
      <Input v-model:value="vucData.id"/>
    </FormItem>
    <FormItem label="备注" name="name">
      <Input v-model:value="vucData.name"/>
    </FormItem>
    <FormItem label="值类型">
      <Select v-model:value="editorId">
        <SelectOption :value="opt.id" v-for="opt in editorOptions">{{ opt.name }}</SelectOption>
      </Select>
    </FormItem>
    <FormItem label="值内容" name="code">
      <value-editor v-model:value="data[editorId]" :editor="editorId"
                    v-bind="editorOption.propsData"/>
    </FormItem>

    <template v-for="formExtra in formExtras">
      <FormItem :label="formItem.label" v-for="formItem in formExtra.formItems" :key="formItem.label">
        <component :is="formItem.component" :vuc-ast="vucAst" :data="vucData"></component>
      </FormItem>
    </template>
  </Form>
</template>
<script>

import { markRaw, nextTick } from 'vue';
import { Form, FormItem, Input, Select, SelectOption } from 'ant-design-vue';
import { CodeEditor } from '@/ui';
import EditorDropdown from '@/core/valueEditors/EditorDropdown';
import ValueEditor from '@/core/valueEditors/ValueEditor';
import { getFormExtras } from './dataExtra';
import { parseEditorOptions } from '@/modes/props/util';
import { parsePath, isIdentifier } from '@/helpers/lang';

export default {
  components: {
    CodeEditor,
    EditorDropdown,
    ValueEditor,
    Form,
    FormItem,
    Input,
    Select,
    SelectOption,
  },
  props: {
    vucAst: Object,
    vucData: Object,
  },
  data() {
    return {
      data: {},
      editorOptions: ['string', 'number', 'boolean?trueText=真&falseText=假', 'expression?#inline=false&height=300'].map(e => parseEditorOptions(e)),
      formExtras: markRaw(getFormExtras()),
      editorId: 'expression',
      parentPath: null,
      ruleValidate: {
        id: [
          {
            required: true,
            message: '标识必填',
            trigger: 'blur',
          },
          {
            validator(rule, value, callback) {
              return new Promise((resolve, reject) => {
                if (!isIdentifier(value)) {
                  reject('非法的标识符');
                }
              });
            },
            trigger: 'blur',
          },
        ],
      },
      isArraySub: /\[\d+\]/.test(this.vucData.id),
    };
  },
  computed: {
    editorOption() {
      return this.getEditorOption(this.editorId);
    },
    title() {
      return `值(${ this.editorOption.name })`;
    },
  },
  watch: {
    editorId(nId, oId) {
      if (!oId) return;
      let curEditor = this.editorOption;
      let code = this.data[oId];
      if (curEditor.validateValue(code)) {
        this.data[nId] = code;
      }
    },
    data: {
      deep: true,
      handler() {
        this.vucData.code = this.data[this.editorId];
      },
    },
    vucData: {
      immediate: true,
      handler() {
        if (this.vucData.path) {
          let { parentPath } = parsePath(this.vucData.path);
          this.parentPath = parentPath;
        }
      },
    },
    'vucData.id'(id) {
      this.vucData.path = this.parentPath ? ( this.parentPath + '.' + id ) : id;
    },
  },
  mounted() {
    this.autoSetEditorId();
  },
  methods: {
    getEditorOption(id) {
      return this.editorOptions.find((e) => e.id === id);
    },
    autoSetEditorId() {
      let code = this.vucData.code;
      if (code === null || code === undefined || isNullValue(code)) {
        this.editorId = 'expression';
      } else {
        let editorOptions = this.editorOptions;
        let option = editorOptions.find((cfg) => cfg.id != 'expression' && cfg.validateValue(code));
        this.editorId = option ? option.id : 'expression';
      }
      this.data[this.editorId] = code;
    },
  },
};

function isNullValue(value) {
  return ['null', '', 'undefined'].includes(value);
}
</script>
