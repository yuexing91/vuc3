<template>
  <div>
    <IconEditor v-for="config in configs" :vuc-node="vucNode" :config="config" :key="config.slot"></IconEditor>
  </div>
</template>

<script>
import { isAntIcon } from './icons';
import IconEditor from './IconEditor';

export default {
  components: {
    IconEditor,
  },
  props: {
    vucNode: Object,
  },
  computed: {
    configs() {
      let configs = this.vucNode?.getConfig('antIcon');
      if (configs) {
        if (Array.isArray(configs)) {
          return configs;
        }
        return [configs];
      } else if (isAntIcon(this.vucNode?.tag)) {
        return [{
          label: '图标',
          isIcon: true,
        }];
      }
    },
  },
};
</script>
