import { getSizeEditor } from '../utils';

export default {
  id: 'a-input-group',
  name: '输入框组',
  type: ['input-group'],
  props: {
    compact: {
      label: '紧凑模式',
      editors: 'boolean',
    },
    size: {
      label: '尺寸',
      editors: getSizeEditor(),
    },
  },
};
