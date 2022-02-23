export default {
  id: 'a-badge-ribbon',
  name: '缎带型徽标',
  slots: [
    {
      slot: 'default',
      name: '内容',
    },
  ],

  type: ['badge-ribbon'],

  props: {
    color: {
      label: '圆点颜色',
      editors: 'string',
    },
    placement: {
      label: '位置',
      editors: 'radio-group?@items=start|end',
    },
    text: {
      label: '状态点文本',
      editors: 'string',
    },
  },
};
