export default {
  id: 'a-tag',
  name: '标签',
  eventTypes: [
    {
      id: 'close',
      name: '关闭',
    },
  ],

  slots: [
    {
      slot: 'default',
      name: '标签内容',
    },
    {
      slot: 'icon',
      name: '图标',
    },
  ],

  type: ['tag'],

  props: {
    closable: {
      label: '可关闭',
      editors: 'boolean',
    },
    color: {
      label: '颜色',
      editors: [
        {
          name: '预设值',
          type: 'select?@items=default|success|processing|error|warning|pink|red|orange|green|cyan|blue|purple',
        },
      ],
    },
    visible: {
      label: '显示状态',
      editors: 'boolean?defaultValue=true',
    },
  },

  antIcon: {
    label: '图标',
    editors: 'icon',
    slot: 'icon',
  },

  childLimit() {
    return false;
  },
};
