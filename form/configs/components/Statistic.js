export default {
  id: 'a-statistic',
  name: '统计数值',
  slots: [
    {
      slot: 'formatter',
      name: '格式化',
    },
    {
      slot: 'prefix',
      name: '前缀',
    },
    {
      slot: 'suffix',
      name: '后缀',
    },
    {
      slot: 'title',
      name: '标题',
    },
  ],

  type: ['statistic'],

  props: {
    value: {
      label: '标题',
      editors: 'string',
    },
    title: {
      label: '标题',
      editors: 'select?@items=circle|square|:default',
    },
    prefix: {
      label: '前缀',
      editors: 'string',
    },
    suffix: {
      label: '后缀',
      editors: 'string',
    },
    decimalSeparator: {
      label: '小数点',
      editors: 'string',
    },
    formatter: {
      label: '格式化',
    },
    valueStyle: {
      label: '样式',
    },
    groupSeparator: {
      label: '千分位分隔符',
      editors: 'string',
    },
    precision: {
      label: '数值精度',
      editors: 'number',
    },
  },

  antIcon: {
    label: '前缀图标',
    editors: 'icon',
    slot: 'prefix',
  },

  childLimit() {
    return false;
  },

};
