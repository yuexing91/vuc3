<template>
  <div>
    <code-list :data="items" @add-item="doEdit" @click-item="doEdit" @delete-item="doDel"/>
    <Modal
        v-model:visible="editState"
        title="编辑"
        destroyOnClose
        width="800px"
        :keyboard="false"
        :mask-closable="false"
        @ok="doSave"
    >
      <watch-form :vucAst="vucAst" :data="curData"/>
    </Modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue';
import isEqual from 'lodash-es/isEqual';

import designerMixins from '../designerMixins.js';
import WatchForm from './WatchForm.vue';
import { CodeList } from '@/ui';

export default {
  components: {
    Modal, WatchForm, CodeList,
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
      return this.vucAst?.watchs;
    },
  },

  methods: {
    doEdit(data) {
      this.editData = data;
      this.curData = Object.assign({ params: [] }, data);
      this.editState = true;
    },

    doSave() {
      if (!this.curData.id) return;
      if (!isEqual(this.curData, this.editData)) {
        this.vucAst.saveWatch(this.curData, this.editData?.id);
      }
      this.editState = false;
    },

    doDel(data) {
      this.vucAst.delWatch(data.id);
    },
  },
};
</script>
