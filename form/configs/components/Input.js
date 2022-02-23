import { getSizeEditor } from '../utils';

export default {
  id: 'a-input',
  name: '输入框',
  type: ['input'],
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
      quick: true,
    },
    {
      id: 'pressEnter',
      name: '按下回车',
    },
  ],

  slots: [
    {
      slot: 'prefix',
      name: '前缀图标',
    },
    {
      slot: 'suffix',
      name: '后缀图标',
    },
    {
      slot: 'addonBefore',
      name: '前置标签',
    },
    {
      slot: 'addonAfter',
      name: '后置标签',
    },
  ],

  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    defaultValue: {
      label: '默认值',
      editors: 'string',
    },
    size: {
      label: '尺寸',
      editors: getSizeEditor(),
    },
    type: {
      label: '类型',
      editors: 'select?@items=text|password|url|email|date|number|tel',
    },
    allowClear: {
      label: '清空按钮',
      editors: 'boolean',
    },
    placeholder: {
      label: '占位文本	',
      editors: 'string',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    readonly: {
      label: '只读',
      editors: 'boolean',
    },
    maxlength: {
      label: '最大输入长度',
      editors: 'number',
    },
    prefix: {
      label: '前缀',
      editors: 'string',
    },
    suffix: {
      label: '后缀',
      editors: 'string',
    },
  },

  vModel: ['value'],

  antIcon: [{
    label: '前缀图标',
    slot: 'prefix',
  }, {
    label: '后缀图标',
    slot: 'suffix',
  }],

};
