<template>
  <Item :title="name">

    <Select v-model:value="type" class="vuc-quick-select" placeholder="请选择方法" style="width: calc(100% -  40px)"
            allowClear>
      <template #dropdownRender="{ menuNode: menu }">
        <v-nodes :vnodes="menu"/>
        <Divider style="margin: 4px 0"/>
        <div
            style="padding: 5px 12px; cursor: pointer"
            @click="addMethod">
          新增方法
          <plus-outlined class="vuc-quick-select-icon"/>
        </div>
      </template>
      <SelectOption v-for="method in methods" :value="method.id" :key="method.id">
        <span>{{ method.id }}</span>
      </SelectOption>
      <SelectOption :value="customCode" label="内联脚本">内联脚本</SelectOption>
    </Select>

    <a style="margin-left: 6px" @click="editEvent">编辑</a>

    <Modal
        v-if="type == customCode"
        v-model:visible="editState"
        title="脚本编辑"
        width="700px"
        :mask-closable="false"
        @ok="saveEvent"
    >
      <CodeEditor v-model:value="editCode"></CodeEditor>
    </Modal>

    <MethodEditorModal ref="methodEditorModal"/>
  </Item>
</template>
<script>

import { Select, SelectOption, Modal, Divider } from 'ant-design-vue';
import { Item } from '@/ui';
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import EditOutlined from '@ant-design/icons-vue/EditOutlined';

import MethodEditorModal from '../methods/MethodEditorModal';
import { CodeEditor } from '@/ui';
import { defaultEvent, getEvents, formatEventName } from './eventConfig';

export default {
  inject: ['$designer'],

  components: {
    Item,
    CodeEditor,
    vNodes: (_, { attrs }) => attrs.vnodes,
    MethodEditorModal,
    EditOutlined,
    PlusOutlined,
    Select,
    SelectOption,
    Modal,
    Divider,
  },

  props: {
    id: String,
    name: String,
    vucNode: Object,
  },

  data() {
    return {
      type: '',
      customCode: 'custom code',
      editCode: '',
      editState: false,
    };
  },

  computed: {
    methods() {
      return this.getMethods();
    },
    eventInfo() {
      return this.getEventInfo();
    },
  },
  watch: {
    type(type) {
      this.setEventCode(type != this.customCode ? type : this.editCode);
    },
    eventInfo: {
      handler(eventInfo) {
        if (eventInfo.code) {
          if (this.methods.find(m => m.id === eventInfo.code)) {
            this.type = eventInfo.code;
          } else {
            this.editCode = eventInfo.code;
            this.type = this.customCode;
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    addMethod() {
      this.$refs.methodEditorModal.doEdit();
    },
    setEventCode(code) {
      if (code !== this.eventInfo.code) {
        this.eventInfo.code = code;
        let name = formatEventName(this.eventInfo);
        if (this.eventInfo.code) {
          this.vucNode.setAttrValue(name, this.eventInfo.code);
        } else {
          this.vucNode.delAttr(name);
        }
      }
    },
    getMethods() {
      let vucAst = this.$designer.editor.vucAst;
      if (vucAst && vucAst.vucInstance) {
        return vucAst.methods;
      }
      return [];
    },
    getEventInfo() {
      if (!this.vucNode) return [];
      let events = getEvents(this.vucNode.getAttrMap());
      let id = this.id;
      return events.find((e) => e.id == id) || defaultEvent({ id });
    },
    editEvent() {
      if (this.type == this.customCode) {
        this.editState = true;
        this.editCode = this.eventInfo.code;
      } else {
        let method = this.methods.find(m => m.id === this.eventInfo.code);
        if (method) {
          this.$refs.methodEditorModal.doEdit(method);
        }
      }
    },
    saveEvent() {
      this.editState = false;
      this.setEventCode(this.editCode);
    },
  },
};
</script>

<style lang="less">
.vuc-quick-select {
  &-icon {
    margin-top: 5px;
    float: right;
    color: #a1a1a1;

    &:hover {
      color: inherit;
    }
  }
}
</style>
