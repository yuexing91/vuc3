<template>
  <a-modal
      v-model:visible="editState"
      title="编辑"
      destroyOnClose
      width="800px"
      :keyboard="false"
      :mask-closable="false"
      @ok="doSave"
  >
    <RequestForm :vucAst="vucAst" :data="curData"/>
  </a-modal>
</template>

<script>
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import RequestForm from './RequestForm.vue';

export default {
  emits: ['save'],

  inject: ['$designer'],

  props: {
    data: Object,
    visible: Boolean,
  },

  components: {
    RequestForm,
  },

  data() {
    return {
      curData: null,
      editState: false,
    };
  },

  watch: {
    visible: {
      immediate: true,
      handler() {
        this.editState = this.visible;
        if (this.visible) {
          this.curData = cloneDeep(Object.assign({ config: {} }, this.data));
        }
      },
    },
    editState() {
      this.$emit('update:visible', this.editState);
    },
  },

  computed: {
    activeEditor() {
      return this.$designer.editor;
    },
    vucAst() {
      return this.activeEditor.vucAst;
    },
  },

  methods: {
    doSave() {
      if (!this.curData.id) return;
      if (!isEqual(this.curData, this.data)) {
        this.vucAst.saveRequest(this.curData, this.data?.id);
        this.$emit('save', this.curData);
      }
      this.editState = false;
    },
  },
};
</script>
