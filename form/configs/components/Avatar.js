export default {
  id: 'a-avatar',
  name: '头像框',
  slots: [
    {
      slot: 'icon',
      name: '图标',
    },
    {
      slot: 'default',
      name: '内容',
    },
  ],

  type: ['avatar'],

  props: {
    size: {
      label: '尺寸',
      editors: [
        {
          name: '像素',
          type: 'number',
        },
        {
          name: '选项',
          type: 'radio-group?@items=large:大|:中|small:小',
        },
      ],
    },
    shape: {
      label: '形状',
      editors: 'select?@items=circle|square|:default',
    },
    src: {
      label: '头像URL',
      editors: 'string',
    },
    srcset: {
      label: '头像响应式URL',
      editors: 'string',
    },
    alt: {
      label: '替代文本',
      editors: 'string',
      help: '图像无法显示时的替代文本',
    },
  },

  childLimit() {
    return false;
  },

  vucProxyOption: {
    textProxy: false,
  },
};
