export default {
  getProps() {
    return {
      arrowPointAtCenter: {
        label: '箭头指向中心',
        editors: 'boolean',
      },
      autoAdjustOverflow: {
        label: '自动调整位置',
        editors: 'boolean?defaultValue=true',
      },
      color: {
        label: '背景颜色',
        editors: 'text',
      },
      visible: {
        label: '控制显示',
      },
      defaultVisible: {
        label: '默认显示',
        editors: 'boolean',
      },
      mouseEnterDelay: {
        label: '延迟显示（秒）',
        editors: 'number',
      },
      mouseLeaveDelay: {
        label: '延迟隐藏（秒）',
        editors: 'number',
      },
      overlayClassName: {
        label: '自定义卡片className',
        editors: 'text',
      },
      overlayStyle: {
        label: '自定义卡片样式',
      },
      placement: {
        label: '位置',
        editors:
          'select?@items=top|left|right|bottom|topLeft|topRight|ottomLeft|bottomRight|leftTop|leftBottom|rightTop|rightBottom',
      },
      trigger: {
        label: '触发行为',
        editors: 'select?@items=hover|focus|click|contextmenu',
      },
      destroyTooltipOnHide: {
        label: '隐藏时销毁',
        editors: 'boolean',
      },
    };
  },
};
