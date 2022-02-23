export default {
  id: 'a-modal',
  name: '对话框',
  type: ['modal'],

  eventTypes: [
    {
      id: 'ok',
      name: '确定',
    },
    {
      id: 'cancel',
      name: '关闭',
    },
  ],

  slots: [
    {
      slot: 'default',
      name: '内容',
    },
    {
      slot: 'title',
      name: '标题',
    },
  ],
  props: {
    title: {
      label: '标题',
      editors: 'string',
    },
    width: {
      label: '宽度',
      editors: 'string',
    },
    maskClosable: {
      label: '允许点击蒙层关闭',
      editors: 'boolean?defaultValue=false',
    },
    keyboard: {
      label: '允许按下 esc 关闭',
      editors: 'boolean?defaultValue=true',
    },
  },

  //对于某些设置不上data-ast-id的组件，只能特殊搞了
  maybeVuc(vm) {
    let $el = vm.$el;
    if ($el.classList?.contains('ant-modal-root')) {
      let dirs = vm.$parent.$parent.$parent.$parent.$.vnode.dirs;
      let dir = dirs && dirs.find((dir) => dir.dir?.name === 'astId');
      if (dir) {
        $el.setAttribute('data-ast-id', dir.value);
        let rect = document.querySelector('.app-wrapper').getBoundingClientRect();
        let style = {
          top: rect.top + 'px',
          left: rect.left + 'px',
          right: window.innerWidth - rect.right + 'px',
          bottom: window.innerHeight - rect.bottom + 'px',
        };

        const t = (selector) => {
          let el = $el.querySelector(selector);
          if (el) {
            Object.assign(el.style, style);
          }
        };
        t('.ant-modal-mask');
        t('.ant-modal-wrap');
      }
    }
  },
};
