export default {
  id: 'a-card-meta',
  name: '卡片网格',
  type: ['panel', 'card'],
  slots: [
    {
      slot: 'avatar',
      name: '头像/图标',
    },
    {
      slot: 'title',
      name: '标题内容',
    },
    {
      slot: 'description',
      name: '描述内容',
    },
  ],
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
