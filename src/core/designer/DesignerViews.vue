<script>
import { TabPane, Tabs } from 'ant-design-vue';
import { h } from 'vue';

export default {
  props: {
    name: String,
  },

  render() {
    let slots = [];
    if (this.$parent.$slots[this.name]) {
      slots = this.$parent.$slots[this.name]();
    }

    return h(Tabs, {
      class: 'vuc-designer-views',
      size: 'small',
      tabBarStyle: {
        margin: 0,
      },
    }, {
      default: () => slots.map((vnode, index) => {
        if (!vnode.props) return vnode;
        return h(TabPane, {
          tab: vnode.props.title,
          key: this.name + '_' + index,
        }, {
          default: () => vnode,
        });
      }),
    });
  },
};
</script>
