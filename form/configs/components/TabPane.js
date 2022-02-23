export default {
  id: 'a-tab-pane',
  name: '标签页',
  type: ['panel', 'tab-pane'],
  slots: [
    {
      slot: 'default',
      name: '内容',
    },
    {
      slot: 'tab',
      name: '标题',
    },
  ],
  props: {
    key: {
      label: 'key',
      editors: 'string',
    },
    tab: {
      label: '标题',
      editors: 'string',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    forceRender: {
      label: '隐藏时渲染',
      editors: 'boolean',
    },
  },
  //可以放到什么地方
  onDrop(dropData, targetNode, pos) {
    let p = pos == 'inner' ? targetNode : targetNode.getParentNode();
    return p.tag === 'aTabs';
  },
};
