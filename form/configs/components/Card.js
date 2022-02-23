export default {
  id: 'a-card',
  name: '卡片',
  eventTypes: [
    {
      id: 'tabChange',
      name: '页签切换',
    },
  ],
  type: ['panel', 'card'],
  slots: [
    {
      slot: 'default',
      name: '卡片内容',
    },
    {
      slot: 'title',
      name: '卡片标题',
    },
    {
      slot: 'extra',
      name: '额外内容',
    },
    {
      slot: 'cover',
      name: '卡片封面',
    },
    {
      slot: 'actions',
      name: '卡片操作组',
//      selector:'.ant-card>.ant-card-actions'
    },
    {
      slot: 'tabBarExtraContent',
      name: '标签页额外内容',
    },
  ],
  props: {
    title: {
      label: '标题',
      editors: 'string',
      help: '标题',
    },
    size: {
      label: '尺寸',
      editors: 'select?@items=default|small',
    },
    type: {
      label: '类型',
      editors: 'select?@items=inner|:default',
    },
    bordered: {
      label: '边框',
      editors: 'boolean?defaultValue=true',
    },
    extra: {
      label: '额外内容',
      editors: 'string',
    },
    headStyle: {
      label: '标题区样式',
    },
    bodyStyle: {
      label: '内容区样式',
    },
    hoverable: {
      label: '悬浮',
      editors: 'boolean',
      help: '鼠标移过时可浮起',
    },
    loading: {
      label: '加载中',
      editors: 'boolean',
      help: '当卡片内容还在加载中时，可以用 loading 展示一个占位',
    },
    tabList: {
      label: '标签页',
    },
    activeTabKey: {
      label: '激活标签页',
      editors: 'string',
    },
    defaultActiveTabKey: {
      label: '默认激活标签页',
      editors: 'string',
      helper: '初始化选中页签的 key，如果没有设置 activeTabKey',
    },
  },
};
