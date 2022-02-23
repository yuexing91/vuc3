export default {
  getProps() {
    return {
      valueFormat: {
        label: '值格式化',
        editors: 'string',
      },
      format: {
        label: '显示格式化',
        editors: 'string',
      },
      inputReadOnly: {
        label: '禁用输入框',
        editors: 'boolean',
      },
      size: {
        label: '尺寸',
        editors: 'select?@items=large:大|:中|small:小',
      },
      mode: {
        label: '面板状态',
        editors: 'select?@items=time|date|month|year|decade',
      },
      open: {
        label: '弹层是否展开',
        editors: 'boolean',
      },
      disabled: {
        label: '禁用',
        editors: 'boolean',
      },
      placeholder: {
        label: '占位符',
        editors: 'string',
      },
      allowClear: {
        label: '清除按钮',
        editors: 'boolean?defaultValue=true',
      },
      autofocus: {
        label: '默认获取焦点',
        editors: 'boolean',
      },
    };
  },
};
