<template>
  <div class="vuc-mode-view">
    <DirectiveForm v-for="directive in directives"
                   :directive="directive"
                   :vucNode="vucNode"
                   :key="directive.name"/>
  </div>
</template>

<script>
import DirectiveForm from './DirectiveForm.vue';
import designerMixins from '../designerMixins.js';
import nodeMixins from '../nodeMixins.js';
import { getDirectives } from '@/modes/directive/systemDirectives';

export default {
  components: {
    DirectiveForm,
  },
  data() {
    return {
      directives: [],
    };
  },
  mixins: [designerMixins, nodeMixins],
  watch: {
    vucNode: {
      handler: 'loadDirectives',
      immediate: true,
    },
  },
  methods: {
    loadDirectives() {
      if (!this.vucNode) {
        return this.directives = [];
      }
      let props = this.vucNode.getDirectives();
      this.directives = getDirectives(this.vucNode.getConfig('vModel'), props);
    },
  },
};

</script>

<style lang="less">

</style>
