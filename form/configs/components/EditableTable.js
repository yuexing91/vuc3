export default {
  id: 'a-editable-table',
  name: '可编辑表格',
  eventTypes: [],
  type: ['table'],
  slots: [
    {
      slot: 'default',
      name: '表格列',
    },
  ],
  props: {
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
    size: {
      label: '尺寸',
      editors: 'select?@items=:大|middle:中|small:小',
    },
    loading: {
      label: '加载中',
      editors: 'boolean',
    },
    scrollX: {
      label: '横向滚动',
      editors: 'number',
    },
  },

  childLimit(childTag) {
    return childTag === 'aEditableTableColumn';
  },

  vucProxyOption: {
    onRender({ attrMap }, context) {
      let key = ':dataSource';
      let dataSource = attrMap[key];

      if (dataSource) {
        attrMap[key] = `${ dataSource } ? ${ dataSource } : [{}]`;
      } else {
        attrMap[key] = '[{}]'
      }
    },
  },

};
