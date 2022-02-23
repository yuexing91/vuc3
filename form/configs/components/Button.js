import { getSizeEditor } from '../utils';

export default {
  id: 'a-button',
  name: '按钮',
  eventTypes: [
    {
      id: 'click',
      name: '点击',
      quick: true,
    },
  ],

  slots: [
    {
      slot: 'default',
      name: '按钮内容',
    },
    {
      slot: 'icon',
      name: '图标',
    },
  ],

  type: ['button'],

  props: {
    type: {
      label: '按钮类型',
      editors: 'select?@items=default|primary|dashed|text|danger|link',
    },
    ghost: {
      label: '幽灵按钮',
      editors: 'boolean',
      help: '幽灵属性，使按钮背景透明',
    },
    size: {
      label: '尺寸',
      editors: getSizeEditor(),
    },
    shape: {
      label: '按钮形状',
      editors: 'select?@items=circle|round|:default',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    loading: {
      label: '载入状态',
      editors: 'boolean',
    },
    block: {
      label: '块级按钮',
      editors: 'boolean',
    },
  },

  antIcon: {
    label: '按钮图标',
    editors: 'icon',
    slot: 'icon',
  },

  text: {
    label: '按钮文本',
  },

  childLimit() {
    return false;
  },

  vucProxyOption: {
    textProxy: false,
  },

  quickStyles: [
    {
      id: 'color',
      name: '字体颜色',
    },
  ],

};
