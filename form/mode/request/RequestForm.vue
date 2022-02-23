<template>
  <a-form
      :model="data"
      :labelCol="{ flex: '110px' } "
      :wrapperCol=" { flex: 1 } "
      :rules="ruleValidate"
      ref="form"
  >
    <a-form-item label="标识符" name="id">
      <a-input v-model:value="data.id" placeholder="请求方法标识符"></a-input>
    </a-form-item>
    <a-form-item label="请求名称" name="name">
      <a-input v-model:value="data.name" placeholder="请求显示名称"></a-input>
    </a-form-item>
    <a-form-item label="方法参数">
      <argument-table v-model:value="data.params"></argument-table>
    </a-form-item>
    <a-form-item label="请求地址" name="url">
      <a-input v-model:value="data.url" placeholder="请求地址"></a-input>
    </a-form-item>
    <a-form-item label="请求方式" name="method">
      <a-select v-model:value="data.method" :options="methodOptions" placeholder="请求方式"></a-select>
    </a-form-item>
    <a-form-item label="请求体" v-if="isShowData">
      <SampleEditor v-model:value="data.config.data"></SampleEditor>
    </a-form-item>
    <a-form-item label="请求参数">
      <RequestParams v-model:value="data.config.params"></RequestParams>
    </a-form-item>
    <a-form-item label="返回结果标识符">
      <a-input v-model:value="data.resultId" placeholder="请求返回结果标识符"></a-input>
    </a-form-item>
    <a-form-item label="结果绑定到变量">
      <RequestBind :result-id="data.resultId" v-model:value="data.binds"></RequestBind>
    </a-form-item>

    <a-form-item label="初始化时加载">
      <a-switch v-model:checked="data.created"></a-switch>
    </a-form-item>


    <!--    <a-form-item label="代码" name="code">
          <code-editor v-model:value="data.code"></code-editor>
        </a-form-item>-->
  </a-form>
</template>
<script>

import { CodeEditor, ArgumentTable } from '@';
import RequestParams from './RequestParams';
import RequestBind from './RequestBind';
import SampleEditor from './SampleEditor';

export default {
  props: {
    data: Object,
    vucAst: Object,
  },
  components: {
    CodeEditor,
    ArgumentTable,
    RequestParams,
    RequestBind,
    SampleEditor,
  },
  computed: {
    isShowData() {
      return ['post', 'put', 'patch'].includes(this.data.method);
    },
  },
  data() {
    return {
      ruleValidate: {
        id: [
          {
            required: true,
            message: '标识必填',
          },
        ],
        url: [
          {
            required: true,
            message: '请求地址必填',
          },
        ],
        method: [
          {
            required: true,
            message: '请求方式必填',
          },
        ],
      },
      methodOptions: [
        {
          label: 'get',
          value: 'get',
        },
        {
          label: 'post',
          value: 'post',
        },
        {
          label: 'delete',
          value: 'delete',
        },
        {
          label: 'put',
          value: 'put',
        },
        {
          label: 'patch',
          value: 'patch',
        },
      ],
    };
  },

  created() {
    if (this.data.id) {
      let property = this.vucAst.getExportProperty('created');
      property?.value.body.body.find(expr => {
        if (expr.expression.type == 'CallExpression') {
          let callee = expr.expression.callee;
          if (callee.type == 'MemberExpression' && callee.object.type == 'ThisExpression' && callee.property.name == this.data.id) {
            this.data.created = true;
          }
        }
      });
    }
  },

};
</script>
