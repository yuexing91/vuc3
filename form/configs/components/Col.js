export default {
  id: ['a-col'],
  name: '栅格',
  eventTypes: [],
  type: ['col'],
  slots: [
    {
      slot: 'default',
      name: '内容',
    },
  ],
  props: {
    flex: {
      label: 'flex',
      editors: 'string',
    },
    span: {
      label: '栅格格数',
      editors: 'number',
      help: '占位格数，可选值为0~24',
    },
    order: {
      label: '顺序',
      editors: 'number',
      help: '栅格的顺序',
    },
    offset: {
      label: '间隔',
      editors: 'number',
      help: '栅格左侧的间隔格数',
    },
    push: {
      label: '向右移动',
      editors: 'number',
      help: '栅格向右移动格数',
    },
    pull: {
      label: '向左移动',
      editors: 'number',
      help: '栅格向左移动格数',
    },
    xs: {
      label: 'xs',
      editors: 'number',
      help: '<576px 响应式栅格',
    },
    sm: {
      label: 'sm',
      editors: 'number',
      help: '≥576px 响应式栅格',
    },
    md: {
      label: 'md',
      editors: 'number',
      help: '≥768px 响应式栅格',
    },
    lg: {
      label: 'lg',
      editors: 'number',
      help: '≥992px 响应式栅格',
    },
    xl: {
      label: 'xl',
      editors: 'number',
      help: '≥1200px 响应式栅格',
    },
    xxl: {
      label: 'xxl',
      editors: 'number',
      help: '≥1600px 响应式栅格',
    },
  },

  parentLimit(parentNode) {
    return parentNode.tag === 'a-row';
  },

};
