<template>
  <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" :model="method" :rules="ruleValidate" ref="form">
    <FormItem label="标识" name="id">
      <Input v-model:value="method.id" placeholder="请输入标识"></Input>
    </FormItem>
    <FormItem label="代码" name="code">
      <code-editor v-model:value="method.code"></code-editor>
    </FormItem>
  </Form>
</template>

<script>
import { Form, FormItem, Input } from 'ant-design-vue';
import { CodeEditor, ArgumentTable } from '@/ui';

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
        id: [{ required: true, message: '标识必填', trigger: 'blur' }],
        code: [{ required: true, message: '代码必填', trigger: 'blur' }],
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
