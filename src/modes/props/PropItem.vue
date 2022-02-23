<template>

  <Item class="vuc-prop-item" v-if="hasConfig && editorOption">
    <template #title>
      <EditorDropdown v-model:editorId="editorId" @update:editorId="changeEditor" :title="title"
                      :editors="editorOptions"/>
      <span class="vuc-prop-item-var" @click="showVariable=true">
        <span class="vuc-prop-item-var-name" v-if="propValue.dataValue">{{ propValue.dataValue }}</span>
        <span class="vuc-prop-item-var-placeholder" v-else>绑定变量</span>
        <LinkOutlined/>
      </span>
    </template>

    <Tooltip
        v-if="editorId == 'expression'"
        color="#f50"
        :title="errorMessager"
        :visible="showError"
        placement="bottomLeft"
    >
      <ValueEditor v-model:value="propValue[editorId]" :editor="editorId" @update:value="changeValue"
                   v-bind="editorOption.propsData"/>
    </Tooltip>
    <ValueEditor v-else v-model:value="propValue[editorId]" :editor="editorId" @update:value="changeValue"
                 v-bind="editorOption.propsData"/>

    <VariableSelect v-if="showVariable"
                    v-model:visible="showVariable"
                    v-model:value="propValue.dataValue"
                    :vuc-ast="vucNode.vucAst"></VariableSelect>

  </Item>

</template>
<script>

import { Tooltip } from 'ant-design-vue';
import DownOutlined from '@ant-design/icons-vue/DownOutlined';
import LinkOutlined from '@ant-design/icons-vue/LinkOutlined';

import { isSimplePath } from '@/helpers/codeType';
import { castArray } from '@/helpers/lang';
import ValueEditor from '@/core/valueEditors/ValueEditor';
import EditorDropdown from '@/core/valueEditors/EditorDropdown';
import { Item } from '@/ui';

import VariableSelect from './VariableSelect';
import { parseEditorOptions } from './util';

export default {
  name: 'prop-item',
  components: {
    ValueEditor,
    DownOutlined,
    LinkOutlined,
    VariableSelect,
    EditorDropdown,
    Item,
    Tooltip,
  },
  emits: ['change'],
  inject: ['$designer'],
  props: {
    name: String,
    label: String,
    config: Object,
    vucNode: Object,
  },
  data() {
    let propConfig = this.getPropConfig();
    let hasConfig = propConfig ? true : false;
    propConfig = Object.assign({}, propConfig, this.config);
    return {
      hasConfig,
      propConfig,
      propValue: {},
      value: null,
      treeData: [],
      editorId: '',
      editorOptions: [],
      errorMessager: '',
      showVariable: false,
    };
  },

  computed: {
    title() {
      return this.label || this.propConfig.label;
    },
    showError() {
      return !!this.errorMessager;
    },
    editorOption() {
      return this.editorOptions.find((e) => e.id == this.editorId);
    },
    propAttr() {
      return this.vucNode.getBind(this.name);
    },
    data() {
      return this.getData();
    },
  },

  watch: {
    'propValue.dataValue'(dataValue) {
      this.changeDataValue(dataValue);
    },
    propAttr() {
      // 通过当前组件修改属性则无需更新
      if (this._isSelfChange_) {
        this._isSelfChange_ = false;
      } else {
        this.updatePropValue();
      }
    },
    data: {
      handler(data, oData) {
        if (oData || data) {
          this.propValue.expression = data?.code;
          this.autoSetEditorId(data?.code);
        }
      },
    },
  },

  created() {
    if (!this.hasConfig) return;
    this.updateEditorOptions();
    this.updatePropValue();
  },

  methods: {

    getData() {
      if (this.propValue.dataValue) {
        return this.vucNode.vucAst.getDataByPath(this.propValue.dataValue);
      }
    },

    getPropConfig() {
      let propsConfig = this.vucNode.getConfig('props');
      return propsConfig && propsConfig[this.name];
    },

    updateEditorOptions() {
      let editorOptions = castArray(this.propConfig.editors)
          .concat(['expression'])
          .map((e) => parseEditorOptions(e, this.vucNode));
      this.editorOptions = editorOptions.filter((e) => e);
    },

    updatePropValue() {
      let propAttr = this.propAttr;
      let propValue = this.propValue;
      propValue.dynamic = false;
      if (propAttr) {
        let value = propAttr.attrValue;
        let dynamic = propAttr.isVBind();
        if (propAttr.onlyAttrName()) {
          dynamic = true;
          value = 'true';
        }
        if (dynamic && isSimplePath(value)) {
          propValue.dataValue = value;
        } else {
          propValue.expression = dynamic ? value : `'${ value }'`;
          this.autoSetEditorId(propValue.expression);
        }
      } else {
        this.editorId = this.editorOptions[0].id;
      }
    },

    changeEditor() {
      let value = this.propValue[this.editorId];
      if (value === undefined || value === null) {
        return;
      }
      this.changeValue();
    },

    changeValue() {
      let dataType = this.editorOption.dataType;
      let value = this.propValue[this.editorId];
      if (value !== null && value !== undefined) {
        value = value.toString();
      }
      let code = value;

      let dataValue = this.propValue.dataValue;
      let isStr = dataType == 'string';
      this.errorMessager = '';
      if (dataValue) {
        let vucAst = this.$designer.editor.vucAst;
        let data = vucAst.getDataByPath(dataValue);
        if (data.path === dataValue && data.code === code) {
          return;
        }
        this.errorMessager = vucAst.saveData({
          id: dataValue.split('.').pop(),
          name: data?.name,
          path: dataValue,
          code,
        });
        vucAst.vucInstance.$forceUpdate();
      } else if (value) {
        if (isStr) {
          value = value.substring(1, value.length - 1);
        }
        this.setNodeAttr(value, !isStr);
      }
    },

    changeDataValue(dataValue) {
      this.setNodeAttr(dataValue, true);
      let code = this.getData()?.code;
      this.propValue.expression = code;
      this.autoSetEditorId(code);
    },

    setNodeAttr(value, dynamic) {
      let propName = this.name;
      let vucNode = this.vucNode;
      let attrName = ( dynamic ? ':' : '' ) + propName;
      let isChange = value ? vucNode.setAttrValue(attrName, value) : vucNode.delAttr(attrName);
      if (isChange) {
        this._isSelfChange_ = true;
        this.$emit('change', { vucNode, value, dynamic });
      }
    },

    autoSetEditorId(code = '') {
      let editorOptions = this.editorOptions.filter((cfg) => cfg.id != 'expression');
      let option = editorOptions.find((cfg) => cfg.validateValue(code));

      if (!option && isNullValue(code) && editorOptions.length) {
        [option] = editorOptions;
      }

      if (option) {
        this.editorId = option.id;
        this.propValue[option.id] = code;
      } else {
        this.editorId = 'expression';
      }
    },
  },
};

function isNullValue(value) {
  return ['null', '', 'undefined'].includes(value);
}
</script>

<style lang="less">
.item-selected {
  background: #bae7ff !important;
  color: rgba(0, 0, 0, 0.85) !important;
}

.vuc-prop-item {
  position: relative;

  &-var {
    position: absolute;
    right: 0;
    top: 0px;
    text-align: right;
    cursor: pointer;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }

    &-name {
      color: #881391;
      margin-right: 4px;
      font: 14px / normal Consolas, "Courier New", monospace;
    }

    &-placeholder {
      color: #c1c1c1;
      margin-right: 5px;
    }
  }
}
</style>
