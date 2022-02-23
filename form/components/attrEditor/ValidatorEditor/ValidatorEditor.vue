<template>
  <div>
    <div class="vuc-valid-item" v-for="(rule, index) in rules" :key="index">
      <Tag v-for="(sub, key) in getSubRule(rule)" :key="index + key">
        {{ sub }}
      </Tag>
      <span @click="editRule(rule, index)" style="cursor: pointer;color: #ff4d4f">{{ rule.message }}</span>
      <CloseOutlined class="vuc-valid-close-btn" @click="removeRule(rule)" style=""/>
    </div>

    <Modal v-model:visible="modalState" title="规则维护" width="700px" @ok="saveRule">
      <RuleForm :rule="rule" v-if="rule"></RuleForm>
    </Modal>

    <Button @click="addRule" type="dashed" block size="small" style="margin-top: 8px;">
      <template #icon>
        <PlusOutlined/>
      </template>
      添加规则
    </Button>
  </div>
</template>

<script>
import { Button, Tag, Modal } from 'ant-design-vue';
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined';
import omitBy from 'lodash-es/omitBy';
import RuleForm from './RuleForm';

import { parseSubRules, parseEnable } from './utils';
import { esprimaHelper } from '@';

export default {
  inject: ['$designer'],
  props: {
    value: String,
    type: {
      type: String,
      // form-item | form
      default: 'form-item',
    },
  },
  components: {
    RuleForm,
    PlusOutlined,
    CloseOutlined,
    Button,
    Tag,
    Modal,
  },
  data() {
    return {
      modalState: false,
      rules: [],
      rule: null,
    };
  },

  watch: {
    value: {
      handler() {
        this.initRules();
      },
      immediate: true,
    },
  },

  methods: {
    initRules() {
      if (this.val == this.value) {
        return;
      }
      try {
        this.rules = new Function(`return ${ this.value }`).call().map(this.parseRule);
      } catch (e) {
        console.error(e);
        this.rules = [];
      }
      this.val = esprimaHelper.formatCode(this.value);
    },

    parseRule(rule) {
      rule = Object.assign({
        state: {},
        required: false,
      }, rule);
      parseEnable(rule);
      return rule;
    },

    getSubRule(rule) {
      return parseSubRules(rule);
    },

    addRule() {
      this.modalState = true;
      this.index = -1;
      this.rule = this.parseRule({});
    },

    editRule(rule, index) {
      this.modalState = true;
      this.index = index;
      this.rule = Object.assign({}, rule, { state: Object.assign({}, rule.state) });
    },

    removeRule(rule) {
      let i = this.rules.indexOf(rule);
      this.rules.splice(i, 1);
      this.updateRules();
    },

    saveRule() {
      this.modalState = false;
      if (this.index == -1) {
        this.rules.push(this.rule);
        this.rule = null;
      } else {
        this.rules.splice(this.index, 1, this.rule);
      }
      this.updateRules();
    },

    updateRules() {
      let code = JSON.stringify(
          this.rules.map((rule) => {
            return omitBy(rule, (v, k) => {
              return k == 'state' || v == null || rule.state[k] === false;
            });
          }),
      );
      this.$emit('update:value', code);
    },
  },
  editorConfig: {
    id: 'validator',
    dataType: 'object',
    name: '验证',
  },
};
</script>

<style lang="less">
.vuc-valid-item {
  .vuc-valid-close-btn {
    display: none;
    cursor: pointer;
    margin-left: 6px;
  }

  &:hover .vuc-valid-close-btn {
    display: inline;
    opacity: 0.8;
  }
}
</style>
