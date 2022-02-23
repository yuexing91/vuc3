import commonDatepickerConfig from '../commonDatepickerConfig';

export default {
  id: 'a-month-picker',
  name: '月份选择框',
  type: ['input', 'month-picker'],
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
  ],

  slots: [],

  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    ...commonDatepickerConfig.getProps(),
  },
  vModel: ['value'],
};
