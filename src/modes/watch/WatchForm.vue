<template>
  <Form
      :model="data"
      :labelCol="{ style: { width: '100px' } }"
      :wrapperCol="{ style: { flex: 1 } }"
      :rules="ruleValidate"
      ref="form"
  >
    <Row>
      <Col :span="12">
        <FormItem label="标识" name="id">
          <Input v-model:value="data.id" placeholder="需观察键标识" :readonly="idReadOnly"></Input>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="备注" name="name">
          <Input v-model:value="data.name"></Input>
        </FormItem>
      </Col>
      <Col :span="24">
        <FormItem label="选项">
          <Checkbox v-model:checked="data.deep">deep</Checkbox>
          <Checkbox v-model:checked="data.immediate">immediate</Checkbox>
        </FormItem>
      </Col>
      <!--      <Col :span="12">
              <FormItem label="immediate" name="immediate">
                <Checkbox v-model:checked="data.immediate"></Checkbox>
              </FormItem>
            </Col>-->
      <Col :span="24">
        <FormItem label="参数列表">
          <argument-table :value="data.params"></argument-table>
        </FormItem>
      </Col>
      <Col :span="24">
        <FormItem label="代码" name="code">
          <code-editor v-model:value="data.code"></code-editor>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>
<script>

import { Form, FormItem, Input, Checkbox, Row, Col } from 'ant-design-vue';
import { CodeEditor, ArgumentTable } from '@/ui';

export default {
  components: {
    CodeEditor, ArgumentTable, Form, FormItem, Input, Checkbox, Row, Col,
  },
  props: {
    idReadOnly: Boolean,
    data: Object,
    vucAst: Object,
  },
  data() {
    return {
      ruleValidate: {
        id: [
          {
            required: true,
            message: '标识必填',
            trigger: 'blur',
          },
        ],
      },
    };
  },
};
</script>
