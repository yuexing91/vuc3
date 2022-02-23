export default {
  inject: ['$designer'],
  computed: {
    activeEditor() {
      return this.$designer.editor;
    },
    vucAst() {
      return this.activeEditor.vucAst;
    },
  },
};
