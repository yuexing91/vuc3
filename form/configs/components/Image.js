export default {
  id: 'a-image',
  name: '图片',
  slots: [
    {
      slot: 'placeholder',
      name: '占位',
    },
  ],

  type: ['image'],

  props: {
    src: {
      label: '图片地址',
      editors: 'string',
    },
    width: {
      label: '宽',
      editors: 'string',
    },
    height: {
      label: '高',
      editors: 'string',
    },
    preview: {
      label: '启用预览',
      editors: 'boolean?defaultValue=true',
    },
    fallback: {
      label: '容错地址',
      editors: 'string',
    },
    alt: {
      label: '图像描述',
      editors: 'string',
    },
  },

  childLimit() {
    return false;
  },
};
