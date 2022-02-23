export default {
  id: 'a-rate',
  name: '评分',
  type: ['input', 'rate'],
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
    {
      id: 'hoverChange',
      name: '鼠标经过变更',
    },
  ],

  slots: [
    {
      slot: 'character',
      name: '自定义字符',
    },
  ],

  props: {
    count: {
      label: '星星总数',
      editors: 'number',
    },
    allowHalf: {
      label: '允许半选',
      editors: 'boolean',
    },
    allowClear: {
      label: '再次点击清除',
      editors: 'boolean?defaultValue=true',
    },
    character: {
      label: '自定义字符',
      editors: 'string',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    tooltips: {
      label: '提示',
    },
    value: {
      label: '值',
      editors: 'number',
    },
  },
  vModel: ['value'],
};
