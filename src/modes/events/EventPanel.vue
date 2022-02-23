<template>
  <div class="vuc-mode-view" v-if="vucNode">
    <Modal v-model:visible="editState" title="事件编辑" width="800px" :mask-closable="false" @ok="saveEvent">
      <event-editor ref="editor" :isHTML="isHTML" :methods="VucMethods" :event="curEvent" :eventTypes="eventTypes"/>
    </Modal>

    <code-list
        :data="curVucNodeEvents"
        @click-item="editorEvent"
        @add-item="addEvent"
        @delete-item="delEvent"
        row-key="id"
        :columns="columns"
    />
  </div>
</template>
<script>
import { Modal } from 'ant-design-vue';
import { CodeList } from '@/ui';

import PlusOutlined from '@ant-design/icons-vue/PlusOutlined';
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined';
import { getEvents, defaultEvent, formatEventName } from './eventConfig';

import EventEditor from './EventEditor.vue';
import designerMixins from '../designerMixins.js';
import nodeMixins from '../nodeMixins.js';

export default {
  components: {
    EventEditor,
    PlusOutlined,
    DeleteOutlined,
    CodeList,
    Modal,
  },

  mixins: [designerMixins, nodeMixins],

  data() {
    return {
      curEvent: {},
      editState: false,
      columns: [
        {
          dataIndex: 'id',
          title: '事件名称',
          editor: true,
          width: 80,
        },
        {
          dataIndex: 'code',
          title: '事件内容',
        },
      ],
    };
  },

  computed: {
    VucMethods() {
      if (this.vucAst) {
        return this.vucAst.methods;
      }
      return [];
    },

    isHTML() {
      return this.vucNode && this.vucNode.isHTML();
    },

    curVucNodeEvents() {
      let vucNode = this.vucNode;
      if (vucNode) {
        return getEvents(vucNode.getAttrMap());
      }
      return [];
    },

    eventTypes() {
      let eventTypes;
      if (this.vucNode) {
        eventTypes = this.vucNode.getConfig('eventTypes');
      }
      return eventTypes || [];
    },
  },
  methods: {
    addEvent() {
      this.editorEvent();
    },
    editorEvent(event) {
      if (!this.vucNode) return;
      this.curEvent = defaultEvent(event);
      this.editState = true;
    },
    saveEvent() {
      let vucNode = this.vucNode;
      this.$refs.editor.validate().then((r) => {
        if (r) {
          let name = formatEventName(this.curEvent);
          vucNode.setAttrValue(name, this.curEvent.code);
          this.editState = false;
        }
      });
    },
    delEvent(event) {
      let vucNode = this.vucNode;
      let name = formatEventName(event);
      vucNode.delAttr(name);
    },
  },
};
</script>
