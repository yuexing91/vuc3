export default {
  id: 'a-list',
  name: '列表',
  slots: [
    {
      slot: 'default',
      name: '列表内容',
    },
    {
      slot: 'header',
      name: '列表头部',
    },
    {
      slot: 'footer',
      name: '列表底部',
    },
    {
      slot: 'loadMore',
      name: '加载更多',
    },
  ],

  type: ['list'],

  props: {
    dataSource: {
      label: '数据源',
    },
    header: {
      label: '列表头部',
      editors: 'string',
    },
    footer: {
      label: '列表底部',
      editors: 'string',
    },
    loading: {
      label: '加载中',
      editors: 'boolean',
    },
    pagination: {
      label: '分页',
      editors: ['boolean'],
    },
    itemLayout: {
      label: '列表布局',
      editors: 'select?:default|vertical',
    },
    size: {
      label: '列表尺寸',
      editors: 'select?default|middle|small',
    },
    split: {
      label: '分割线',
      editors: 'boolean',
    },
    rowKey: {
      label: 'rowKey',
      editors: 'string',
      help: '列表每一项 key 的取值，可以是字符串或一个函数',
    },
  },

  childLimit(childTag){
    return childTag === 'aListItem';
  }
};
