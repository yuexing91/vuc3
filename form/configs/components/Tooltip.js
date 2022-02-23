import commonTooltipConfig from '../commonTooltipConfig';

export default {
  id: 'a-tooltip',
  name: '文字提示',

  slots: [
    {
      slot: 'default',
      name: '内容',
    },
  ],

  type: ['tooltip'],

  props: {
    title: {
      label: '提示文字',
      editors: 'string',
    },
    ...commonTooltipConfig.getProps(),
  },
};
