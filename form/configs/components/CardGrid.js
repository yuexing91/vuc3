export default {
  id: 'a-card-grid',
  name: '卡片网格',
  type: ['panel', 'card'],
  slots: [
    {
      slot: 'default',
      name: '卡片网格内容',
    },
  ],
  props: {
    hoverable: {
      label: '悬浮',
      editors: 'boolean',
      help: '鼠标移过时可浮起',
    },
  },
};
