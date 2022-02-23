import { getSizeEditor } from '../utils';

export default {
  id: 'a-input-number',
  name: '数字框',
  type: ['input', 'input-number'],
  eventTypes: [
    {
      id: 'change',
      name: '值改变',
    },
    {
      id: 'pressEnter',
      name: '按下回车',
    },
  ],
  slots: [],
  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    defaultValue: {
      label: '默认值',
      editors: 'string',
    },
    step: {
      label: '步长',
      editors: 'number',
    },
    precision: {
      label: '数值精度',
      editors: 'number',
    },
    decimalSeparator: {
      label: '小数点',
      editors: 'string',
    },
    size: {
      label: '尺寸',
      editors: getSizeEditor(),
    },
    disabled: {
      label: '禁用',
      editors: 'boolean',
    },
    max: {
      label: '最大值',
      editors: 'number',
    },
    min: {
      label: '最小值',
      editors: 'number',
    },
    formatter: {
      label: '格式化',
    },
    parser: {
      label: '解析器',
    },
  },
  vModel: ['value'],
};
