export default {
  id: 'a-switch',
  name: '开关',
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
  ],
  type: ['input', 'switch'],
  props: {
    size: {
      label: '尺寸',
      editors: 'radio-group?@items=:默认|small:小',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    checkedChildren: {
      label: '选中时文本',
      editors: 'string',
    },
    unCheckedChildren: {
      label: '未选中文本',
      editors: 'string',
    },
    autofocus: {
      label: '自动获取焦点',
      editors: 'boolean',
    },
    loading: {
      label: '加载中状态',
      editors: 'boolean',
    },
    checked: {
      label: '是否选中',
      editors: 'boolean',
    },
  },

  vModel: ['checked'],

  vucProxyOption: {
    textProxy: false,
  },
};
