export default {
  id: 'a-checkbox-group',
  name: '复选框组',
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
  ],
  slots: [
    {
      slot: 'label',
      name: '复选框标签',
    },
  ],
  type: ['input', 'checkbox-group'],
  props: {
    value: {
      label: '默认值',
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
    name: {
      label: '名称',
      editors: 'string',
    },
  },
  vModel: ['value'],

  optionEditor: {
    title: '复选框选项',
    tag: 'a-checkbox',
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

  vucProxyOption: {
    onBeforeRender(vucNode, context) {
      vucNode.dfs((node) => {
        context.cancelOutline(node);
      });
    },
  },
};
