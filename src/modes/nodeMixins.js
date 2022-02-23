export default {
  props: {
    vucNode: Object,
  },
  computed: {
    isTextNode() {
      return this.vucNode && this.vucNode.isText();
    },
  },
};
