import { getSizeEditor } from '../utils';

export default {
  id: 'a-input-password',
  name: '输入框',
  type: ['input'],
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

  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    size: {
      label: '尺寸',
      editors: getSizeEditor(),
    },
    visibilityToggle: {
      label: '切换按钮',
      editors: 'boolean?defaultValue=true',
    },
    placeholder: {
      label: '占位文本	',
      editors: 'string',
    },
  },
  vModel: ['value'],
};
