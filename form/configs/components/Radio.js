export default {
  id: 'a-radio',
  name: '单选框',
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
  ],
  type: ['input', 'radio'],
  props: {
    checked: {
      label: '是否选中',
      editors: 'boolean',
    },
    value: {
      label: '值',
      editors: 'string',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
  },

  vModel: ['checked'],

  vucEditorOption: {
    onBeforeSelectNode(vucNode) {
      return vucNode.parent.tag !== 'aRadioGroup';
    },
  },

  vucProxyOption: {
    textProxy: false,
  },
};
