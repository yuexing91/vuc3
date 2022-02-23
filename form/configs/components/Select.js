import { getSizeEditor } from '../utils';

export default {
  id: ['a-select'],
  name: '下拉框',
  eventTypes: [
    {
      id: 'change',
      name: '值变更',
    },
    {
      id: 'select',
      name: '选中',
    },
    {
      id: 'deselect',
      name: '取消选中',
    },
    {
      id: 'focus',
      name: '获得焦点',
    },
    {
      id: 'blur',
      name: '失去焦点',
    },
    {
      id: 'inputKeydown',
      name: '键盘按下',
    },
    {
      id: 'mouseenter',
      name: '鼠标移入',
    },
    {
      id: 'mouseleave',
      name: '鼠标移出',
    },
    {
      id: 'dropdownVisibleChange',
      name: '展开下拉菜单',
    },
    {
      id: 'popupScroll',
      name: '下拉列表滚动',
    },
    {
      id: 'search',
      name: '搜索时',
    },
  ],

  type: ['input', 'select'],

  slots: [
    {
      slot: 'placeholder',
      name: '选择框默认文字',
    },
    {
      slot: 'notFoundContent',
      name: '下拉列表为空时内容',
    },
    {
      slot: 'suffixIcon',
      name: '后缀图标',
    },
    {
      slot: 'removeIcon',
      name: '多选框清除图标',
    },
    {
      slot: 'clearIcon',
      name: '多选框清空图标',
    },
    {
      slot: 'menuItemSelectedIcon',
      name: '选中的条目图标',
    },
  ],

  props: {
    mode: {
      label: '模式',
      editors: 'select?@items=default:单选|multiple:多选|tags:标签|combobox:组合框',
    },

    options: {
      label: '下拉选项',
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
      help: '选项数据，如果设置则不需要手动构造 selectOption 节点',
    },

    value: {
      label: '值',
      editors: 'string',
    },
    bordered: {
      label: '边框',
      editors: 'boolean?defaultValue=true',
    },
    size: {
      label: '尺寸',
      editors: getSizeEditor(),
    },
    autofocus: {
      label: '默认获取焦点',
      editors: 'boolean',
    },
    placeholder: {
      label: '占位文本	',
      editors: 'string',
    },
    allowClear: {
      label: '清空按钮',
      editors: 'boolean',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    maxTagCount: {
      label: '最多显示标签数',
      editors: 'number',
    },
    maxTagTextLength: {
      label: '最大标签文本长度',
      editors: 'number',
    },
    open: {
      label: '展开',
      editors: 'boolean',
      help: '是否展开下拉菜单',
    },
    defaultOpen: {
      label: '默认展开',
      editors: 'boolean',
      help: '是否默认展开下拉菜单',
    },
    readonly: {
      label: '只读',
      editors: 'boolean',
    },
    showSearch: {
      label: '可搜索',
      editors: 'boolean',
      help: '使单选模式可搜索',
    },
    showArrow: {
      label: '下拉箭头',
      editors: 'boolean?defaultValue=true',
    },
  },

  vModel: ['value'],

  optionEditor: {
    title: '下拉框选项',
    tag: 'a-select-option',
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
