<template>
  <Item v-if="config" :title="config.label">
    <Input v-model:value="text" @blur="change" @pressEnter="change" spellcheck="false"></Input>
  </Item>
</template>

<script>
import { Input } from 'ant-design-vue';
import { Item } from '@/ui';
import { isObject } from '@/helpers/lang';
import designerMixins from '../designerMixins.js';
import nodeMixins from '../nodeMixins.js';

export default {
  components: {
    Item, Input,
  },
  mixins: [designerMixins, nodeMixins],

  data() {
    return {
      text: '',
    };
  },

  computed: {
    config() {
      if (this.vucNode == null) return;
      let text = this.vucNode.getConfig('text');
      if (this.vucNode.isText() || text === true) {
        return {
          label: '文本',
        };
      } else if (isObject(text)) {
        return text;
      }
    },
  },

  watch: {
    vucNode: {
      handler() {
        if (this.vucNode == null) return;
        this.text = this.getText();
      },
      immediate: true,
    },
  },

  methods: {
    change() {
      if (this.getText() != this.text) {
        this.vucNode.setText(this.text);
      }
    },
    getText() {
      return this.vucNode.getText();
    },
  },
};
</script>
