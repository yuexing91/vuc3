<template>
  <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" :model="method" :rules="ruleValidate" ref="form">
    <FormItem label="标识" name="id">
      <Input v-model:value="method.id" placeholder="请输入标识"></Input>
    </FormItem>
    <FormItem label="名称" name="name">
      <Input v-model:value="method.name" placeholder="请输入名称"></Input>
    </FormItem>
    <FormItem label="参数列表">
      <argument-table :value="method.params"></argument-table>
    </FormItem>
    <FormItem label="代码" name="code">
      <code-editor v-model:value="method.code"></code-editor>
    </FormItem>
  </Form>
</template>

<script>
import { Form, FormItem, Input } from 'ant-design-vue';
import { CodeEditor, ArgumentTable } from '@/ui';
import { isIdentifier } from '@/helpers/lang';

export default {
  components: {
    CodeEditor, ArgumentTable, Form, FormItem, Input,
  },
  props: {
    method: Object,
  },
  data() {
    return {
      ruleValidate: {
        id: [
          { required: true, message: '标识必填', trigger: 'blur' },
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

  methods: {
    validate() {
      return this.$refs.form.validate();
    },
  },
};
</script>
