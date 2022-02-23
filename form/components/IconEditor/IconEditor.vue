<template>
  <div class="vuc-item">
    <div class="vuc-item-header">
      <span style="font-weight: 500">
        图标：{{ config.label }}
      </span>
    </div>
    <div class="vuc-item-body">
      <IconSelect v-model:value="icon" @update:value="setIcon"></IconSelect>
    </div>
  </div>
</template>

<script>
import { createVucNode } from '@';
import { isAntIcon } from './icons';
import IconSelect from './IconSelect';

export default {
  components: {
    IconSelect,
  },
  props: {
    config: Object,
    vucNode: Object,
  },

  data() {
    return {
      icon: '',
      iconNode: null,
    };
  },

  watch: {
    vucNode: {
      handler(vucNode) {
        if (!vucNode) return;
        if (this.config.isIcon) {
          this.iconNode = vucNode;
        } else {
          this.updateIconNode();
        }
        this.icon = this.iconNode?.tag;
      },
      immediate: true,
    },
  },

  methods: {
    setIcon() {
      if (this.iconNode) {
        if (this.icon) {
          this.iconNode.tag = this.icon;
        } else {
          if (this.iconNode.parent.tag == 'template') {
            this.iconNode.parent.remove();
          } else {
            this.iconNode.remove();
          }
          this.iconNode = null;
        }
      } else if (this.icon) {
        let node = createVucNode(`<template #${ this.config.slot }><${ this.icon }/></template>`);
        this.vucNode.appendNode(node);
        this.updateIconNode();
      }
    },

    updateIconNode() {
      let node = this.vucNode.children.find((child) => child.getSlotName() == this.config.slot);
      if (node?.isTemplateNode()) {
        this.iconNode = node.children.find((child) => isAntIcon(child.tag));
      } else if (node && isAntIcon(node.tag)) {
        this.iconNode = node;
      }
    },
  },
};
</script>
