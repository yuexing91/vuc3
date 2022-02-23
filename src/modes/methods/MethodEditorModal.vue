<template>
  <Modal v-model:visible="editState" title="方法编辑" width="800px" @ok="doSave" :mask-closable="false" destroyOnClose>
    <method-editor ref="editor" :method="curData"/>
  </Modal>
</template>

<script>
import { Modal } from 'ant-design-vue';
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import MethodEditor from './MethodEditor.vue';
import designerMixins from '../designerMixins.js';

export default {
  mixins: [designerMixins],

  data() {
    return {
      editState: false,
      curData: {},
    };
  },

  components: {
    MethodEditor, Modal,
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
  },
};
</script>
