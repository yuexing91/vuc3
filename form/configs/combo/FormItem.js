let template = `<a-form-item key="formItem">
      <type.input key="input" allowChildren="true"/>
    </a-form-item>`;

export default {
  id: 'FormItem',
  name: '表单项',
  template,
  configs() {
    return [
      {
        title: '属性',
        mode: 'prop',
        items: [
          {
            nodeKey: 'formItem',
            name: 'name',
            label: '字段名',
          },
          {
            nodeKey: 'input',
            name: 'size',
            label: '尺寸',
          },
        ],
      },
    ];
  },
};
