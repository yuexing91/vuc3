export default {
  id: 'a-list-item-meta',
  name: '列表项',
  slots: [
    {
      slot: 'avatar',
      name: '图标',
    },
    {
      slot: 'title',
      name: '标题',
    },
    {
      slot: 'description',
      name: '描述',
    },
  ],

  type: ['list-item-meta'],

  props: {
    title: {
      label: '标题',
      editors: 'string',
    },
    description: {
      label: '描述',
      editors: 'string',
    },
  },
};
