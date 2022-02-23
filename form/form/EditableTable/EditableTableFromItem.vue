<script type="text/jsx">
export default {
  props: {
    rules: [Array, Object],
    name: [String, Array],
  },

  data() {
    return {
      error: null,
    };
  },

  directives: {
    custom: {
      updated(el, binding) {
        binding.instance.error = el.querySelector('.ant-form-item-explain')?.innerText;
      },
    },
  },

  render() {
    let rules = this.rules;
    let popoverSlots = {
      content: () => {
        return <>
          { this.error }
        </>;
      },
    };

    return <a-popover trigger="focus" v-slots={ popoverSlots } visible={ !!this.error }>
      <a-form-item className="row-form-item" name={ this.name } v-custom rules={ rules }
                   style="margin: -5px 0;">
        { this.$slots.default() }
      </a-form-item>
    </a-popover>;
  },
};
</script>
