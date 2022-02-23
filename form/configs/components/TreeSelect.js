import { getSizeEditor } from '../utils';

export default {
  id: ['a-tree-select'],
  name: '树形选择框',
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
    {
      id: 'select',
      name: '选中',
    },
    {
      id: 'search',
      name: '搜索时',
    },
    {
      id: 'treeExpand',
      name: '展开树',
    },
  ],
  type: ['input', 'tree-select'],

  slots: [
    {
      slot: 'placeholder',
      name: '选择框默认文字',
    },
  ],

  vModel: ['value', 'treeExpandedKeys', 'searchValue'],

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
      label: '多选',
      editors: 'boolean',
    },
    treeCheckable: {
      label: '复选框',
      editors: 'boolean',
    },
    treeIcon: {
      label: '显示树节点图标',
      editors: 'boolean',
    },
    size: {
      label: '尺寸',
      editors: getSizeEditor(),
    },
    autofocus: {
      label: '默认获取焦点',
      editors: 'boolean',
    },
    placeholder: {
      label: '占位文本	',
      editors: 'string',
    },
    allowClear: {
      label: '清空按钮',
      editors: 'boolean',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    maxTagCount: {
      label: '最多显示标签数',
      editors: 'number',
    },
    maxTagPlaceholder: {
      label: '隐藏标签时显示的内容',
    },
    showSearch: {
      label: '可搜索',
      editors: 'boolean',
      help: '使单选模式可搜索',
    },
    value: {
      label: '值',
      editors: 'string',
    },
    defaultValue: {
      label: '默认值',
      editors: 'string',
    },
  },
};
