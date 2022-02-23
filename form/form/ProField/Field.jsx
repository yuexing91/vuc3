export default {
  name: 'ap-field',
  emits: ['update:value'],
  props: {
    value: {},
    valueType: {
      type: String,
      default: 'text',
    },
    valueEnum: Object,
    request: Function,
    mode: String,
  },

  computed: {
    val: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
      },
    },
  },

  methods: {
    renderStateValue(value) {
      let item = this.valueEnum[value];
      if (item.state) {
        return <a-badge status={item.state} text={item.label}></a-badge>;
      }
      return <span>{item.label}</span>;
    },
  },

  render() {
    if (this.mode == 'read') {
      if (this.valueEnum) {
        if (Array.isArray(this.value)) {
          return <a-space> {this.value.map(this.renderStateValue)} </a-space>;
        }
        return this.renderStateValue(this.value);
      }

      return this.value;
    }

    if (this.valueType === 'text') {
      return <a-input v-model={[this.val, 'value']}></a-input>;
    }
  },
};
