export default {
  id: ['a-select-opt-group'],
  name: '选项分组',
  eventTypes: [],
  props: {
    label: {
      label: '组名',
      editors: 'string',
    },
  },

  vucProxyOption: {
    textProxy: false,
  },

  vucEditorOption: {
    onBeforeSelectNode: false,
  },
};
