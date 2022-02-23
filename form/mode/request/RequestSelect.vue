<template>
  <a-input-group compact>
    <a-select v-model:value="data.requestId" style="width: 140px" allowClear>
      <template #dropdownRender="{ menuNode: menu }">
        <v-nodes :vnodes="menu"/>
        <a-divider style="margin: 4px 0"/>
        <div
            style="padding: 5px 12px; cursor: pointer"
            @click="addRequest">
          新增请求
          <plus-outlined class="req-edit-icon"/>
        </div>
      </template>

      <a-select-option :value="req.id" v-for="req in requests">
        <span> {{ req.name || req.id }}</span>
        <EditOutlined @click.stop="editorRequest(req)" class="req-edit-icon"/>
      </a-select-option>

    </a-select>
    <a-input v-model:value="data.requestValue" class="req-bind-val" style="width: calc(100% - 300px)"
             :prefix="curRequestResultId"></a-input>

    <a-checkbox v-model:checked="data.updataRequest" style="line-height: 32px">更新请求</a-checkbox>
  </a-input-group>

  <RequestFormModal v-model:visible="formModalVisible" :data="editReq" @save="onSaveRequest"></RequestFormModal>

</template>
<script>

import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import EditOutlined from '@ant-design/icons-vue/EditOutlined';

import RequestFormModal from './RequestFormModal';

export default {
  inject: ['$designer'],

  props: {
    data: Object,
  },

  components: {
    PlusOutlined,
    EditOutlined,
    RequestFormModal,
    VNodes: (_, { attrs }) => {
      return attrs.vnodes;
    },
  },
  data() {
    return {
      formModalVisible: false,
      editReq: null,
    };
  },
  computed: {
    activeEditor() {
      return this.$designer.editor;
    },
    vucAst() {
      return this.activeEditor.vucAst;
    },
    requests() {
      return this.vucAst?.requests;
    },
    options() {
      return this.requests?.map(req => {
        return {
          label: req.name || req.id,
          value: req.id,
        };
      });
    },
    curRequest() {
      return this.requests.find(req => req.id == this.data.requestId);
    },
    curRequestResultId() {
      let resultId = this.curRequest?.resultId;
      return resultId || '';
    },
  },

  watch: {
    'data.id': {
      immediate: true,
      handler() {
        let { request, bind } = this.vucAst.findDataBindRequest(this.data.path);
        if (request) {
          this.data.requestId = request.id;
          this.data.requestValue = bind.value;
        }
      },
    },
    'data.requestId'(requestId) {
      if (!requestId) {
        this.data.requestValue = '';
      }
    },
  },

  methods: {
    addRequest() {
      this.formModalVisible = true;
      this.editReq = null;
    },
    editorRequest(req) {
      this.formModalVisible = true;
      this.editReq = req;
    },
    onSaveRequest(request) {
      this.data.requestId = request.id;
      this.data.requestValue = '';
    },
  },
};
</script>
