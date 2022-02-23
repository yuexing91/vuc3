<template>
  <div>
    <code-list :data="items" @add-item="doEdit" @click-item="doEdit" @delete-item="doDel"/>
    <Modal v-model:visible="editState" title="方法编辑" width="800px" @ok="doSave" :mask-closable="false" destroyOnClose>
      <HookEditor ref="editor" :method="curData"/>
    </Modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue';
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import designerMixins from '../designerMixins.js';
import HookEditor from './HookEditor.vue';
import { CodeList } from '@/ui';

export default {
  mixins: [designerMixins],

  data() {
    return {
      editState: false,
      curData: {},
    };
  },

  components: {
    Modal, HookEditor, CodeList,
  },

  computed: {
    items() {
      return this.vucAst ? this.vucAst.hooks : [];
    },
  },

  methods: {
    doEdit(data) {
      this.editData = data;
      this.curData = cloneDeep(Object.assign({ params: [] }, data));
      this.editState = true;
    },

    doSave() {
      if (!this.curData.id) return;
      this.$refs.editor.validate().then((valid) => {
        if (valid) {
          if (!isEqual(this.curData, this.editData)) {
            this.vucAst.saveMethod(this.curData, this.editData?.id);
          }
          this.editState = false;
        }
      });
    },

    doDel(data) {
      this.vucAst.delMethod(data.id);
    },
  },
};
</script>
