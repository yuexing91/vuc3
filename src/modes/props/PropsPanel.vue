<template>
  <PropPanel class="vuc-mode-view" :items="props"/>
</template>

<script>

import PropPanel from './PropPanel.vue';
import nodeMixins from '../nodeMixins';

export default {
  components: {
    PropPanel,
  },

  mixins: [nodeMixins],

  computed: {
    props() {
      let props = [];
      let vucNode = this.vucNode;
      if (!vucNode) {
        return props;
      }

      let VucConfig = vucNode.getConfig();
      if (!VucConfig) {
        return props;
      }


      for(let name in VucConfig.props) {
        props.push({
          name,
          vucNode,
        });
      }

      return props;
    },
  },
};
</script>

<style lang="less">
.props-advanced-btn {
  display: block;
  margin: 0 auto;
  padding: 4px;
  text-align: center;
  font-size: 12px;

  i {
    transition: all 0.2s ease-in-out;
  }
}

.props-advanced-open {
  .props-advanced-btn {
    i {
      transform: rotate(180deg);
    }
  }
}
</style>
