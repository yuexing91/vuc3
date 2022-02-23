export default {
  id: 'a-slider',
  name: '滑动输入条',
  eventTypes: [
    {
      id: 'afterChange',
      name: '鼠标松开',
    },
    {
      id: 'change',
      name: '值改变',
    },
  ],
  type: ['input', 'slider'],
  props: {
    max: {
      label: '最大值',
      editors: 'number',
    },
    min: {
      label: '最小值',
      editors: 'number',
    },
    range: {
      label: '双滑块模式',
      editors: 'boolean',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    included: {
      label: '刻度关系',
      editors: 'boolean?trueText=包含&falseText=并列',
    },
    marks: {
      label: '刻度',
    },
    dots: {
      label: '强制刻度',
      editors: 'boolean',
    },
    reverse: {
      label: '坐标轴反转',
      editors: 'boolean',
    },
    step: {
      label: '步长',
      editors: 'string',
    },
    tipFormatter: {
      label: '提示格式化',
    },
    tooltipVisible: {
      label: '始终显示提示',
      editors: 'boolean',
    },
    vertical: {
      label: '垂直模式',
      editors: 'boolean',
    },
    value: {
      label: '值',
      editors: 'number',
    },
  },

  vModel: ['checked'],

  vucProxyOption: {
    textProxy: false,
  },
};
