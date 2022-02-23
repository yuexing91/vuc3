let template = `
<a-col key="col">
  <a-form-item key="formItem">
    <type.input key="input" allowChildren="true"/>
  </a-form-item>
</a-col>`;

export default {
  id: 'GridFormItem',
  name: '栅格表单项',
  template,
  configs(combo) {
    let configs = [
      {
        title: '属性',
        mode: 'prop',
        items: [
          {
            nodeKey: 'formItem',
            name: 'name',
          },
          {
            nodeKey: 'col',
            name: 'span',
            label: '栅格',
          },
          {
            nodeKey: 'formItem',
            name: 'label',
            label: '字段标签',
          },
          {
            nodeKey: 'formItem',
            name: 'required',
          },
          {
            nodeKey: 'input',
            name: 'options',
          },
          {
            nodeKey: 'input',
            name: 'autosize',
          },
          {
            nodeKey: 'input',
            name: 'min',
          },
          {
            nodeKey: 'input',
            name: 'max',
          },
          {
            nodeKey: 'input',
            name: 'count',
          },
          {
            nodeKey: 'input',
            name: 'allowHalf',
          },
          {
            nodeKey: 'input',
            name: 'size',
          },
          {
            nodeKey: 'input',
            name: 'checkedChildren',
          },
          {
            nodeKey: 'input',
            name: 'unCheckedChildren',
          },
          {
            nodeKey: 'input',
            name: 'valueFormat',
          },
          {
            nodeKey: 'input',
            name: 'format',
          },
          {
            nodeKey: 'input',
            name: 'allowClear',
          },
          {
            nodeKey: 'input',
            name: 'mode',
            excludeTags: ['a-date-picker'],
          },
          {
            nodeKey: 'input',
            name: 'placeholder',
          },
          {
            nodeKey: 'input',
            name: 'showTime',
          },
          {
            nodeKey: 'input',
            name: 'step',
          },
          {
            nodeKey: 'input',
            name: 'disabled',
          },
          {
            nodeKey: 'formItem',
            name: 'rules',
          },
        ],
      },
      {
        title: '事件',
        mode: 'event',
        items: [
          {
            nodeKey: 'input',
            id: 'change',
            name: '值变更事件',
          },
        ],
      },
      {
        title: '样式',
        mode: 'style',
        items: [
          {
            nodeKey: 'input',
            id: 'width',
            name: '宽度',
            excludeTags: ['a-checkbox-group', 'a-radio-group'],
          },
        ],
      },
    ];

    return configs;
  },
};
