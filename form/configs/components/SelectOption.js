export default {
  id: ['a-select-option'],
  name: '选项',
  eventTypes: [],
  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    label: {
      label: '值',
      editors: 'string',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
  },

  vucProxyOption: {
    textProxy: false,
  },

  vucEditorOption: {
    onBeforeSelectNode: false,
  },

};
