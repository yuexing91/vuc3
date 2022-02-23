import { getSizeEditor } from '../utils';

export default {
  id: 'a-auto-complete',
  name: '自动完成',
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
    {
      id: 'select',
      name: '选中',
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
      id: 'dropdownVisibleChange',
      name: '展开下拉菜单',
    },
    {
      id: 'search',
      name: '搜索时',
    },
  ],
  type: ['input', 'auto-complete'],
  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    defaultValue: {
      label: '默认值',
      editors: 'string',
    },
    options: {
      label: '数据源',
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
    allowClear: {
      label: '清空按钮',
      editors: 'boolean',
    },
    defaultActiveFirstOption: {
      label: '默认高亮第一个',
      editors: 'boolean?defaultValue=true',
    },
    placeholder: {
      label: '占位文本	',
      editors: 'string',
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    readonly: {
      label: '只读',
      editors: 'boolean',
    },
    backfill: {
      label: '方向键反馈',
      editors: 'boolean',
      help: '使用键盘选择选项的时候把选中项回填到输入框中',
    },
  },
  vModel: ['value'],
};
