import commonTooltipConfig from '../commonTooltipConfig';

export default {
  id: 'a-popconfirm',
  name: '气泡确认框',
  eventTypes: [
    {
      id: 'cancel',
      name: '点击取消按钮',
    },
    {
      id: 'confirm',
      name: '点击确认按钮',
    },
    {
      id: 'visibleChange',
      name: '切换显示隐藏',
    },
  ],

  slots: [
    {
      slot: 'title',
      name: '标题',
    },
    {
      slot: 'icon',
      name: '图标',
    },
    {
      slot: 'default',
      name: '内容',
    },
  ],

  type: ['tooltip'],

  props: {
    title: {
      label: '卡片文字',
      editors: 'string',
    },
    content: {
      label: '卡片内容',
      editors: 'string',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    okText: {
      label: '确认按钮文本',
      editors: 'string',
    },
    cancelText: {
      label: '取消按钮文本',
      editors: 'string',
    },
    okType: {
      label: '确认按钮类型',
      editors: 'select?@items=default|primary|dashed|text|danger|link',
    },
    ...commonTooltipConfig.getProps(),
  },
};
