<template>
  <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" :model="vucData" :rules="ruleValidate">
    <FormItem label="标识" name="id">
      <Input v-model:value="vucData.id" placeholder=""/>
    </FormItem>
    <FormItem label="名称">
      <Input v-model:value="vucData.name" placeholder=""/>
    </FormItem>
    <FormItem label="表达式">
      <code-editor v-model:value="vucData.code" :height="300"></code-editor>
    </FormItem>
    <template v-for="formExtra in formExtras">
      <FormItem :label="formItem.label" v-for="formItem in formExtra.formItems" :key="formItem.label">
        <component :is="formItem.component" :vuc-ast="vucAst" :data="vucData"></component>
      </FormItem>
    </template>
  </Form>
</template>

<script>
import { Form, FormItem, Input } from 'ant-design-vue';

import { CodeEditor } from '@/ui';
import { getFormExtras } from './dataExtra';
import { isIdentifier } from '@/helpers/lang';

export default {
  components: {
    CodeEditor, Form, FormItem, Input,
  },
  props: {
    vucData: Object,
    vucAst: Object,
  },
  data() {
    return {
      formExtras: getFormExtras(),
      ruleValidate: {
        id: [
          {
            required: true,
            message: '标识必填',
            trigger: 'blur',
          },
          {
            validator(rule, value) {
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
    };
  },
};
</script>
