<template>
  <div>
    <code-list :data="items" @add-item="doEdit" @click-item="doEdit" @delete-item="doDel"></code-list>
    <Modal title="编辑" v-model:visible="editState" width="800px" @ok="doSave" :mask-closable="false" destroyOnClose>
      <computed-form :vucAst="vucAst" :vucData="curData"></computed-form>
    </Modal>
  </div>
</template>

<script>

import { Modal } from 'ant-design-vue';
import isEqual from 'lodash-es/isEqual';
import designerMixins from '../designerMixins.js';
import ComputedForm from './ComputedForm.vue';
import { CodeList } from '@/ui';

export default {
  components: {
    ComputedForm,
    CodeList,
    Modal,
  },

  mixins: [designerMixins],

  data() {
    return {
      curData: null,
      editState: false,
    };
  },

  computed: {
    items() {
      return this.vucAst ? this.vucAst.computeds : [];
    },
  },

  methods: {
    doEdit(data) {
      this.editData = data;
      this.curData = Object.assign({}, data);
      this.editState = true;
    },

    doSave() {
      if (!this.curData.id) return;
      if (!isEqual(this.curData, this.editData)) {
        this.vucAst.saveComputed(this.curData, this.editData?.id);
      }
      this.editState = false;
    },

    doDel(data) {
      this.vucAst.delComputed(data.id);
    },
  },
};
</script>
