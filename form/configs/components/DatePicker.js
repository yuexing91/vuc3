import commonDatepickerConfig from '../commonDatepickerConfig';

export default {
  id: 'a-date-picker',
  name: '日期选择框',
  type: ['input', 'date-picker'],
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
    {
      id: 'ok',
      name: '点击确定',
    },
  ],

  slots: [],

  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    showTime: {
      label: '支持选择时间',
      editors: 'boolean',
    },
    ...commonDatepickerConfig.getProps(),
    showToday: {
      label: '显示今天按钮',
      editors: 'boolean?defaultValue=true',
    },
  },
  vModel: ['value'],
};
