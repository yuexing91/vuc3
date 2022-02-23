import commonDatepickerConfig from '../commonDatepickerConfig';

export default {
  id: 'a-week-picker',
  name: '星期选择框',
  type: ['input', 'week-picker'],
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
