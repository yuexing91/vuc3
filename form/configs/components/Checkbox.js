export default {
  id: 'a-checkbox',
  name: '复选框',
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
  ],
  type: ['input', 'checkbox'],
  props: {
    checked: {
      label: '是否选中',
      editors: 'boolean',
    },
    value: {
      label: '值',
      editors: 'string',
    },
    autofocus: {
      label: '自动获取焦点',
      editors: 'boolean',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    indeterminate: {
      label: 'indeterminate',
      editors: 'boolean',
    },
  },

  vModel: ['checked'],

  vucEditorOption: {
    onBeforeSelectNode(vucNode) {
      return vucNode.parent.tag !== 'aCheckboxGroup';
    },
  },

  vucProxyOption: {
    textProxy: false,
  },
};
