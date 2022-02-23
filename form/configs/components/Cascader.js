export default {
  id: 'a-cascader',
  name: '级联选择框',
  type: ['input', 'cascader'],
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
    {
      id: 'search',
      name: '搜索时',
    },
  ],

  slots: [],

  props: {
    options: {
      label: '选项数据源',
      editors: {
        type: 'array',
        props: {
          keyName: 'value',
          isTreeData: true,
          fields: [
            {
              name: 'value',
              label: '选项值',
            },
            {
              name: 'label',
              label: '选项文本',
            },
          ],
        },
      },
    },
    loadData: {
      label: '动态加载',
      help: '用于动态加载选项，无法与 showSearch 一起使用',
    },
    size: {
      label: '尺寸',
      editors: 'select?@items=large:大|:中|small:小',
    },
    expandTrigger: {
      label: '移入展开',
      editors: 'boolean',
    },
    changeOnSelect: {
      label: '选择即改变',
      editors: 'boolean',
    },
    allowClear: {
      label: '清除按钮',
      editors: 'boolean?defaultValue=true',
    },
    autofocus: {
      label: '默认获取焦点',
      editors: 'boolean',
    },
    showSearch: {
      label: '可搜索',
      editors: 'boolean',
    },
    notFoundContent: {
      label: '搜索为空提示文本',
      editors: 'string',
    },
    placeholder: {
      label: '占位符',
      editors: 'string',
    },
    value: {
      label: '值',
      editors: 'string',
    },
    defaultValue: {
      label: '默认值',
    },
  },
  vModel: ['value'],
};
