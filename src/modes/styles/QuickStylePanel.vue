<template>
  <div>
    <quick-style-item
        v-for="style in styleConfigs"
        :key="style.id"
        :id="style.id"
        :name="style.name"
        :vucNode="style.vucNode || vucNode"
    />
  </div>
</template>
<script>

import QuickStyleItem from './QuickStyleItem';

export default {
  components: {
    QuickStyleItem,
  },
  props: {
    items: Array,
    vucNode: Object,
  },
  data() {
    return {
      styleConfigs: this.items,
    };
  },
  watch: {
    vucNode: {
      immediate: true,
      handler: 'updateStyleConfigs',
    },
    items() {
      this.styleConfigs = this.items;
    },
  },
  methods: {
    updateStyleConfigs(vucNode) {
      if (!vucNode) return;
      this.styleConfigs = vucNode.getConfig('quickStyles') || [];
    },
  },
};
</script>
