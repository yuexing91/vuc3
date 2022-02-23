export default {
  id: 'a-tree',
  name: '树形控件',
  eventTypes: [
    {
      id: 'check',
      name: '点击复选框',
    },
    {
      id: 'load',
      name: '节点加载完成',
    },
    {
      id: 'expand',
      name: '展开/收起',
    },
    {
      id: 'select',
      name: '点击树节点',
    },
    {
      id: 'rightClick',
      name: '点击右键',
    },
  ],
  type: ['tree'],
  slots: [
    {
      slot: 'title',
      name: '表格标题',
    },
  ],
  props: {
    treeData: {
      label: '数据源',
    },
    loadData: {
      label: '异步加载',
    },
    replaceFields: {
      label: '替代字段',
    },
    multiple: {
      label: '允许多选',
      editors: 'boolean',
    },
    checkable: {
      label: '复选框',
      editors: 'boolean',
    },
    checkStrictly: {
      label: '取消复选框级联选择',
      editors: 'boolean',
    },
    showLine: {
      label: '显示连接线',
      editors: 'boolean',
    },
    showIcon: {
      label: '显示图标',
      editors: 'boolean',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    draggable: {
      label: '允许拖拽',
      editors: 'boolean',
    },
    selectable: {
      label: '允许选中',
      editors: 'boolean?defaultValue=true',
    },
    autoExpandParent: {
      label: '自动展开父节点',
      editors: 'boolean?defaultValue=true',
    },
    selectedKeys: {
      label: '选中的树节点',
    },
  },
};
