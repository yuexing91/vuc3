<template>
  <div>
    <code-list :data="requests" @add-item="doEdit" @click-item="doEdit" @delete-item="doDel"/>
    <RequestFormModal v-model:visible="editState" :data="editData"></RequestFormModal>
  </div>
</template>

<script>
import { Components } from '@';
import RequestFormModal from './RequestFormModal.vue';

let { CodeList } = Components;

export default {
  components: {
    CodeList,
    RequestFormModal,
  },

  inject: ['$designer'],
  data() {
    return {
      editData: null,
      editState: false,
    };
  },

  mounted() {
//    this.doEdit(this.requests[0]);
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
  },

  methods: {
    doEdit(data) {
      this.editData = data;
      this.editState = true;
    },

    doDel(data) {
      this.vucAst.delRequest(data.id);
    },
  },
};
</script>
