import { getSizeEditor } from '../utils';

export default {
  id: 'a-input-search',
  name: '搜索框',
  eventTypes: [
    {
      id: 'search',
      name: '搜索',
    },
  ],
  slots: [
    {
      slot: 'enterButton',
      name: '确认按钮',
    },
  ],
  type: ['input'],
  props: {
    value: {
      label: '值',
      editors: 'string',
    },
    defaultValue: {
      label: '默认值',
      editors: 'string',
    },
    loading: {
      label: '搜索中状态',
      editors: 'boolean',
    },
    enterButton: {
      label: '确认按钮',
      editors: 'boolean',
    },
    size: {
      label: '尺寸',
      editors: getSizeEditor(),
    },
    placeholder: {
      label: '占位文本	',
      editors: 'string',
    },
  },
  vModel: ['value'],
};
