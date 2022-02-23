<template>
  <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" :model="event" :rules="ruleValidate" ref="form">
    <FormItem label="事件类型" name="id">
      <Select v-model:value="event.id">
        <SelectOptGroup v-for="group in eventGroups" :label="group.name" :key="group.name">
          <SelectOption v-for="eve in group.events" :value="eve.id" :label="eve.label || eve.id" :key="eve.id">
            <span>{{ eve.label || eve.id }}</span>
            <span style="color: #aaa; margin-left: 12px">{{ eve.name }}</span>
          </SelectOption>
        </SelectOptGroup>
      </Select>
    </FormItem>

    <FormItem label="事件修饰符">
      <Select v-model:value="event.modifiers" mode="multiple">
        <SelectOption v-for="modifier in modifiers" :value="modifier.id" :label="modifier.id" :key="modifier.id">
          <span>{{ modifier.id }}</span>
          <span style="color: #aaa; margin-left: 12px">{{ modifier.desc }}</span>
        </SelectOption>
      </Select>
    </FormItem>

    <FormItem label="按键修饰符" v-if="showKeyModifier">
      <Select v-model:value="event.keyModifier">
        <SelectOption v-for="modifier in keyModifiers" :value="modifier.id" :label="modifier.id" :key="modifier.id">
        </SelectOption>
      </Select>
    </FormItem>

    <FormItem label="鼠标修饰符" v-if="showMouseModifier">
      <Select v-model:value="event.mouseModifier">
        <SelectOption
            v-for="modifier in mouseModifiers"
            :value="modifier.id"
            :label="modifier.id"
            :key="modifier.id"
        >
        </SelectOption>
      </Select>
    </FormItem>

    <FormItem label="系统修饰" v-if="showSysModifier">
      <Select v-model:value="event.sysModifiers" mode="multiple">
        <SelectOption v-for="modifier in sysModifiers" :value="modifier.id" :label="modifier.id" :key="modifier.id">
        </SelectOption>
      </Select>
    </FormItem>

    <FormItem label="代码" name="code">
      <Select v-model:value="type">
        <SelectOption
            v-for="method in methods"
            :key="method.id"
            :value="method.id"
            :label="method.name || method.id"
        >
          <span>{{ method.id }}</span>
          <span style="color: #aaa; margin-left: 12px" v-if="method.name">{{ method.name }}</span>
        </SelectOption>
        <SelectOption :value="customCode" label="内联脚本">内联脚本</SelectOption>
      </Select>
      <code-editor v-if="type === customCode" v-model:value="event.code" style="margin-top: 10px"></code-editor>
    </FormItem>
  </Form>
</template>
<script>

import { Form, FormItem, Input, Select, SelectOption, SelectOptGroup } from 'ant-design-vue';

import { CodeEditor } from '@/ui';

import {
  getHtmlEvents,
  getComponentEvents,
  EVENT_MODIFIERS,
  SYS_MODIFIERS,
  KEY_MODIFIERS,
  MOUSE_MODIFIERS,
} from './eventConfig';

export default {
  components: {
    CodeEditor, Form, FormItem, Input, Select, SelectOption, SelectOptGroup,
  },
  props: {
    methods: {
      type: Array,
      default() {
        return [];
      },
    },
    event: Object,
    eventTypes: Array,
    isHTML: Boolean,
  },
  data() {
    return {
      ruleValidate: {
        id: [{ required: true, message: '事件类型必选' }],
        code: [{ required: true, message: '代码必填', trigger: 'blur' }],
      },
      modifiers: EVENT_MODIFIERS,
      sysModifiers: SYS_MODIFIERS,
      keyModifiers: KEY_MODIFIERS,
      mouseModifiers: MOUSE_MODIFIERS,
      type: '',
      customCode: 'custom code',
    };
  },
  computed: {
    eventGroups() {
      if (this.isHTML || this.eventTypes == null) {
        return getHtmlEvents();
      }
      return [
        {
          name: '组件事件',
          events: this.eventTypes,
        },
      ].concat(getComponentEvents(this.eventTypes));
    },

    eventConfig() {
      return this.findEvent(this.event.id);
    },

    showKeyModifier() {
      return this.eventConfig && this.eventConfig.keyModifier;
    },

    showMouseModifier() {
      return this.eventConfig && this.eventConfig.mouseModifier;
    },

    showSysModifier() {
      return this.showKeyModifier || this.showMouseModifier;
    },
  },

  watch: {
    type(type) {
      if (type !== this.customCode) {
        this.event.code = type;
      }
    },
    event: {
      handler() {
        if (this.methods.find(m => m.id === this.event.code)) {
          this.type = this.event.code;
        } else {
          this.type = this.customCode;
        }
      },
      immediate: true,
    },
  },

  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    findEvent(id) {
      return this.eventGroups.flatMap(g => g.events).find((event) => event.id === id);
    },
  },
};
</script>
