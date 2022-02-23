<template>
  <Form :label-width="{ style: { width: '100px' } }" :wrapper-col="{ flex: 1 }">
    <Form-item label="错误信息">
      <Input v-model:value="rule.message" allowClear placeholder="请输入错误信息"></Input>
    </Form-item>

    <Form-item label="验证时机">
      <Select v-model:value="rule.trigger" allowClear style="width: 170px">
        <Select-option value="change">改变值</Select-option>
        <Select-option value="blur">失去焦点</Select-option>
      </Select>
    </Form-item>

    <Form-item>
      <template #label>
        <Checkbox v-model:checked="rule.state.required">必填</Checkbox>
      </template>
      <Switch v-model:checked="rule.required" checked-children="是" un-checked-children="否"/>
    </Form-item>

    <Form-item>
      <template #label>
        <Checkbox v-model:checked="rule.state.type">类型</Checkbox>
      </template>
      <Select v-model:value="rule.type" style="width: 170px" clearable>
        <Select-option :key="k" :value="k" v-for="(t, k) in types">{{ t }}</Select-option>
      </Select>
    </Form-item>

    <Form-item>
      <template #label>
        <Checkbox v-model:checked="rule.state.range">范围</Checkbox>
      </template>
      <Input-number v-model:value="rule.min"/>
      -
      <Input-number v-model:value="rule.max"/>
    </Form-item>

    <Form-item>
      <template #label>
        <Checkbox v-model:checked="rule.state.len">长度</Checkbox>
      </template>
      <Input-number v-model:value="rule.len"/>
    </Form-item>

    <Form-item>
      <template #label>
        <Checkbox v-model:checked="rule.state.pattern">正则</Checkbox>
      </template>
      <VucCodeEditor v-model:value="rule.pattern" inline style="width: 100%"></VucCodeEditor>
    </Form-item>
  </Form>
</template>

<script>
import { Form, FormItem, Input, Checkbox, InputNumber } from 'ant-design-vue';
import { CodeEditor } from '@';
import { types } from './utils';

export default {
  name: 'RuleForm',
  components: {
    VucCodeEditor: CodeEditor, Form, FormItem, Input, Checkbox, InputNumber,
  },
  props: {
    rule: Object,
  },
  data() {
    return {
      types,
    };
  },
  mounted() {
    let t = {
      min: 'range',
      max: 'range',
      len: 'len',
      type: 'type',
      required: 'required',
      pattern: 'pattern',
    };

    for(let key in t) {
      let state = t[key];
      this.$watch(`rule.${ key }`, () => {
        this.rule.state[state] = true;
      });
    }
  },
};
</script>
