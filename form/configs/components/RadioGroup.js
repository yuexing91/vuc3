export default {
  id: 'a-radio-group',
  name: '单选框组',
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
  ],
  type: ['input', 'radio'],
  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    defaultValue: {
      label: '默认选中的值',
      editors: 'string',
    },
    options: {
      label: '选项',
      editors: {
        name: '选项',
        type: 'array',
        props: {
          keyName: 'value',
          fields: [
            {
              name: 'value',
              label: '选项值',
            },
            {
              name: 'label',
              label: '选项文本',
            },
            {
              name: 'disabled',
              label: '禁用',
              type: 'boolean',
            },
          ],
        },
      },
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    size: {
      label: '尺寸',
      editors: 'select?@items=large|default|small',
      help: '只对按钮样式生效',
    },
    buttonStyle: {
      label: '按钮风格样式',
      editors: 'select?@items=outline|solid',
      help: '只对按钮样式生效',
    },
    name: {
      label: '名称',
      editors: 'string',
    },
  },

  optionEditor: {
    title:'单选框选项',
    tag: 'a-radio',
    getData(node) {
      return {
        value: node.getAttrValue('value'),
        label: node.getText(),
      };
    },
    setData(node, data) {
      node.setAttrValue('value', data.value);
      node.setText(data.label);
    },
  },

  vModel: ['value'],

  vucProxyOption: {
    textProxy: false,
  },
};
