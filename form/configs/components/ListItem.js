export default {
  id: 'a-list-item',
  name: '列表项',
  slots: [
    {
      slot: 'default',
      name: '内容',
    },
    {
      slot: 'actions',
      name: '操作栏',
    },
    {
      slot: 'extra',
      name: '额外内容',
    },
  ],

  type: ['list-item'],

  props: {
    extra: {
      label: '额外内容',
      editors: 'string',
    },
  },
};
