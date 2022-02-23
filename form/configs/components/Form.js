export default {
  id: 'a-form',
  name: '表单',
  eventTypes: [],
  type: ['container', 'form'],
  slots: [
    {
      slot: 'default',
      name: '内容',
      rules: {
        type: /^(container)$/,
      },
    },
  ],
  props: {
    model: {
      label: '数据对象',
    },
    rules: {
      label: '验证规则',
    },
    labelAlign: {
      label: '标签对齐方式',
      editors: 'radio-group?@items=left:左|right:右',
    },
    layout: {
      label: '表单布局',
      editors: 'select?@items=horizontal:水平|vertical:垂直|inline:行内',
    },
    labelCol: {
      label: '标签布局',
      editors: 'col',
    },
    wrapperCol: {
      label: '控件布局',
      editors: 'col',
    },
    hideRequiredMark: {
      label: '必填标记',
      editors: 'boolean',
    },
    colon: {
      label: '标签冒号',
      editors: 'boolean?defaultValue=true',
    },
  },
};
