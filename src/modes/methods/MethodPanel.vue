<template>
  <div>
    <code-list :data="items" @add-item="doEdit" @click-item="doEdit" @delete-item="doDel"/>
    <MethodEditorModal ref="modal"/>
  </div>
</template>

<script>
import designerMixins from '../designerMixins.js';
import MethodEditorModal from './MethodEditorModal.vue';
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
    MethodEditorModal,
    CodeList,
  },

  computed: {
    items() {
      return this.vucAst ? this.vucAst.methods : [];
    },
  },

  methods: {
    doEdit(data) {
      this.$refs.modal.doEdit(data)
    },

    doDel(data) {
      this.vucAst.delMethod(data.id);
    },
  },
};
</script>
