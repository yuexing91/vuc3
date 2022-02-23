<template>
  <div v-if="comboModes" class="vuc-mode-view">
    <template v-for="mode in comboModes" :key="mode.title">
      <component
          :is="mode.Component"
          v-bind="mode.componentProps"
      />
    </template>
  </div>
</template>
<script>

import { getComboMode } from './comboMode';
import designerMixins from '../designerMixins.js';
import nodeMixins from '../nodeMixins.js';

export default {
  emits: ['combo-change'],

  mixins: [designerMixins, nodeMixins],

  data() {
    return {
      combo: null,
    };
  },

  computed: {

    comboModes() {
      let configs = this.combo?.getOptionConfigs();
      return configs?.map(config => {
        let comboMode = getComboMode(config.mode);
        return {
          title: config.title,
          Component: comboMode.Component,
          componentProps: comboMode.parseComponentProps(config, this.combo),
        };
      });
    },

  },

  watch: {
    vucNode: {
      handler(node) {
        this.combo = node ? this.vucAst.maybeCombo(node) : null;
      },
      immediate: true,
    },
    combo(combo) {
      this.$emit('combo-change', combo);
    },
  },

  methods: {},
};
</script>
