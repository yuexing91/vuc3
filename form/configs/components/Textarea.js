export default {
  id: 'a-textarea',
  name: '文本域',
  eventTypes: [
    {
      id: 'pressEnter',
      name: '按下回车',
    },
  ],
  type: ['input', 'textarea'],
  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    defaultValue: {
      label: '默认值',
      editors: 'string',
    },
    allowClear: {
      label: '清空按钮',
      editors: 'boolean',
    },
    autosize: {
      label: '高度自适应',
      editors: 'boolean',
    },
    showCount: {
      label: '字数统计',
      editors: 'boolean',
    },
    placeholder: {
      label: '占位文本	',
      editors: 'string',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    readonly: {
      label: '只读',
      editors: 'boolean',
    },
  },
  vModel: ['value'],
};
