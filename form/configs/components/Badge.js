export default {
  id: 'a-badge',
  name: '徽标数',
  slots: [
    {
      slot: 'count',
      name: '展示的数字',
    },
    {
      slot: 'default',
      name: '内容',
    },
  ],

  type: ['badge'],

  props: {
    count: {
      label: '展示内容',
      editors: 'string',
    },
    overflowCount: {
      label: '最大展示数字',
      editors: 'number',
    },
    dot: {
      label: '显示圆点',
      editors: 'boolean',
    },
    color: {
      label: '圆点颜色',
      editors: 'string',
    },
    showZero: {
      label: '为零显示',
      editors: 'boolean',
    },
    status: {
      label: '状态点',
      editors: 'select?@items=success|processing|default|error|warning',
    },
    offset: {
      label: '状态点位置偏移',
    },
    numberStyle: {
      label: '状态点样式',
    },
    title: {
      label: '状态点标题',
      editors: 'string',
    },
    text: {
      label: '状态点文本',
      editors: 'string',
    },
  },
};
