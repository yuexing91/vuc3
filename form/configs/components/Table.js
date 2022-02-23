export default {
  id: 'a-table',
  name: '表格',
  eventTypes: [],
  type: ['table'],
  slots: [
    {
      slot: 'default',
      name: '表格列',
    },
    {
      slot: 'title',
      name: '表格标题',
    },
    {
      slot: 'footer',
      name: '表格尾部',
    },
  ],
  props: {
    columns: {
      label: '列信息',
    },
    dataSource: {
      label: '数据源',
    },
    rowKey: {
      label: 'rowKey',
      editors: 'string',
    },
    bordered: {
      label: '边框',
      editors: 'boolean',
    },
    showHeader: {
      label: '显示表头',
      editors: 'boolean?defaultValue=true',
    },
    size: {
      label: '尺寸',
      editors: 'select?@items=:大|middle:中|small:小',
    },
    tableLayout: {
      label: '表格布局',
      editors: 'select?@items=:无|auto:自动|fixed:固定',
    },
    pagination: {
      label: '分页',
      editors: 'boolean?defaultValue=true',
    },
    loading: {
      label: '加载中',
      editors: 'boolean',
    },
    expandRowByClick: {
      label: '点击行展开子行',
      editors: 'boolean',
    },
    indentSize: {
      label: '树形缩进',
      editors: 'number',
    },
  },

  childLimit(childTag) {
    return childTag === 'aTableColumn';
  },

  optionEditor: {
    title: '表格列',
    tag: 'a-table-column',
    getData(node) {
      return {
        value: node.getAttrValue('value'),
        label: node.getAttrValue('label') || node.getText(),
      };
    },
    setData(node, data) {
      node.setAttrValue('value', data.value);
      if (node.getBind('label')) {
        node.setAttrValue('label', data.label);
      } else {
        node.setText(data.label);
      }
    },
  },
};
