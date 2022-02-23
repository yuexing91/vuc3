export default {
  id: 'a-tabs',
  name: '标签页组',
  eventTypes: [
    {
      id: 'change',
      name: '标签页切换',
    },
    {
      id: 'edit',
      name: '新增或删除',
    },
    {
      id: 'nextClick',
      name: '点击下一页',
    },
    {
      id: 'prevClick',
      name: '点击上一页',
    },
    {
      id: 'tabClick',
      name: '标签页点击',
    },
  ],
  type: ['panel', 'tabs'],
  slots: [
    {
      slot: 'default',
      name: '内容',
    },
    {
      slot: 'tabBarExtraContent',
      name: '额外内容',
    },
  ],
  props: {
    activeKey: {
      label: '激活标签页',
      editors: 'string',
    },
    size: {
      label: '尺寸',
      editors: 'select?@items=small:小|default:中|large:大',
    },
    type: {
      label: '类型',
      editors: 'select?@items=line:默认|card:卡片|editable-card:可编辑卡片',
    },
    tabPosition: {
      label: '位置',
      editors: 'select?@items=top|right|bottom|left',
      help: '页签位置',
    },
    tabBarGutter: {
      label: '间隙',
      editors: 'number',
      help: 'tabs 之间的间隙',
    },
    tabBarStyle: {
      label: '样式',
      help: 'tab bar 的样式',
    },
    animated: {
      label: '动画切换',
      editors: 'boolean?defaultValue=true',
    },
  },
  vModel: ['activeKey'],
  //可以放置什么东西
  childLimit(childTag) {
    return childTag === 'aTabPane';
  },

  editorTools: [
    {
      title: '添加标签页',
      icon: 'PlusCircleOutlined',
      handler(e, node) {
        node.appendNode(`<a-tab-pane tab="新增标签页${node.children.length + 1}"></a-tab-pane>`);
      },
    },
  ],
};
