import commonTooltipConfig from '../commonTooltipConfig';

export default {
  id: 'a-popover',
  name: '气泡卡片',

  slots: [
    {
      slot: 'title',
      name: '卡片标题',
    },
    {
      slot: 'content',
      name: '卡片内容',
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
    ...commonTooltipConfig.getProps(),
  },
};
