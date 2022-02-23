import commonDatepickerConfig from '../commonDatepickerConfig';

export default {
  id: 'a-range-picker',
  name: '时间范围选择框',
  type: ['input', 'range-picker'],
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
    separator: {
      label: '分隔符',
      editors: 'string',
    },
    showTime: {
      label: '支持选择时间',
      editors: 'boolean',
    },
    ...commonDatepickerConfig.getProps(),
  },
  vModel: ['value'],
};
