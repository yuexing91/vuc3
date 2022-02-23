export default {
  id: 'a-calendar',
  name: '日历',
  slots: [],

  eventTypes: [
    {
      id: 'panelChange',
      name: '面板变化',
    },
    {
      id: 'select',
      name: '日期选择',
    },
    {
      id: 'change',
      name: '日期变化',
    },
  ],

  type: ['calendar'],

  props: {
    fullscreen: {
      label: '全屏显示',
      editors: 'boolean',
    },
    mode: {
      label: '初始模式',
      editors: 'radio-group?@items=month:月|year:年',
    },
    value: {
      label: '值',
      editors: 'string',
    },
    valueFormat: {
      label: '格式化',
      editors: 'string',
    },
  },

  childLimit() {
    return false;
  },

  vucProxyOption: {
    textProxy: false,
  },
};
