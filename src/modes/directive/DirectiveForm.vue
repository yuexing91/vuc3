<template>
  <Form ref="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :model="editData" :show-message="false">
    <div class="vuc-direct">
      <div class="vuc-direct-header">
        <span class="vuc-direct-title" :title="directive.describe"> {{ dirName }} </span>
        <span class="vuc-direct-extra">
          <Switch v-model:checked="directive.enable" size="small" @change="changeEnable(directive)"/>
        </span>
      </div>

      <div class="vuc-direct-body" v-if="directive.enable">
        <FormItem
            v-for="prop in directive.props"
            :name="prop.name"
            :required="prop.required"
            :label="prop.describe"
            :key="prop.name"
        >
          <code-editor style="margin-top: -4px" v-if="editState" v-model:value="editData[prop.name]" inline sm/>
          <code v-else @click="setEditState(true)">{{ directive.data[prop.name] }}</code>
        </FormItem>

        <div v-if="editState" style="text-align: right; margin: 6px 0">
          <Button @click="saveForm" size="small" type="primary">确定</Button>
          <Button @click="setEditState(false)" size="small" style="margin-left: 6px">取消</Button>
        </div>
      </div>
    </div>
  </Form>
</template>

<script>
import { Form, FormItem, Button, Switch } from 'ant-design-vue';
import { createSimpleObj } from './systemDirectives';

import { CodeEditor } from '@/ui';

export default {
  components: {
    CodeEditor, Form, FormItem, Button, Switch,
  },
  props: {
    directive: Object,
    vucNode: Object,
  },
  data() {
    return {
      editState: false,
      editData: null,
    };
  },

  computed: {
    dirName() {
      let { name, arg } = this.directive;
      name = `v-${ name }`;
      return arg ? ( name + ':' + arg ) : name;
    },
  },

  watch: {
    editState(editState) {
      if (editState) {
        this.editData = Object.assign({}, this.directive.data);
      }
    },
  },

  methods: {
    setEditState(state) {
      this.editState = state;
      if (!state) {
        this.directive.enable = !this.directive.openEnable;
        this.directive.openEnable = false;
//        this.validate()
//            .then((success) => {
//              if (!success) {
//                this.directive.enable = false;
//                this.changeEnable();
//              }
//            })
//            .catch(() => {
//              this.$refs.form.clearValidate();
//            });
      }
    },

    changeEnable() {
      this.editState = this.directive.enable;
      if (this.editState) {
        this.directive.openEnable = true;
      } else {
        let { name } = createSimpleObj(this.directive);
        this.vucNode.delAttr(name);
      }
    },

    saveForm() {
      this.validate().then((success) => {
        if (success) {
          this.editState = false;
          this.directive.data = this.editData;
          this.directive.openEnable = false;

          let { name, value } = createSimpleObj(this.directive);
          this.vucNode.setAttrValue(name, value);
          if (name === 'v-for') {
            this.vucNode.setAttrValue(':key', this.editData.key);
          }
        }
      });
    },

    validate() {
      return this.$refs.form.validate();
    },
  },
};
</script>

<style lang="less">
.vuc-direct {
  position: relative;
  margin-bottom: 6px;

  &-header {
    padding: 2px;
    position: relative;
  }

  &-title {
    font: 14px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;
    color: #fa795e;
  }

  &-extra {
    position: absolute;
    right: 0px;
  }

  &-body {
    padding: 2px 12px 0px;
  }

  .ant-form-item {
    margin-bottom: 6px;

    .ant-form-item-control,
    .ant-form-item-label {
      line-height: 26px;
    }
  }
}
</style>
