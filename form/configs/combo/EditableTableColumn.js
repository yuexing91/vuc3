let template = `
<a-editable-table-column key="column">
  <template>
    <type.input key="input" allowChildren="true"/>
  </template>
</a-editable-table-column>`;

export default {
  id: 'EditableTableColumn',
  name: '表单项',
  template,
  constructor() {
  },
  configs() {

    return [
      {
        title: '属性',
        mode: 'prop',
        items: [
          {
            nodeKey: 'column',
            name: 'dataIndex',
            label: '字段名',
          },
          {
            nodeKey: 'column',
            name: 'title',
            label: '标签',
          },
        ],
      },
    ];
  },
};
