import DropManager from '../../drop/DropManager';
import { someHandlerIsFalse } from '@/helpers/lang';

import { getVucEditorHook } from '@/core/config';

function getNodeHook(node, hook) {
  let option = node?.getConfig('vucEditorOption');
  return option && option[hook];
}

export default {
  data() {
    return {
      dropManager: new DropManager(),
    };
  },

  mounted() {
    this.bindEvent();
  },

  unmounted() {
    for (let name in this.__events__) {
      this.__events__[name].forEach((fn) => {
        document.body.removeEventListener(name, fn);
      });
    }
  },

  methods: {
    bindEvent() {
      this.bindHoverEvent();
      this.bindSelectEvent();
      this.bindDropmoveEvent();
      this.bindDropupEvent();
      this.bindContextmenuEvent();
    },

    getHookHandlers(name) {
      let fns = [];
      if (this.options[name]) {
        fns.push(this.options[name]);
      }

      return fns.concat(getVucEditorHook(name));
    },

    handlerHook(hook, otherHandler, ...args) {
      let handlers = this.getHookHandlers(hook);
      if (otherHandler !== undefined) {
        handlers.push(otherHandler);
      }
      return someHandlerIsFalse(handlers, ...args);
    },

    bindHoverEvent() {
      document.body.addEventListener('mouseover', (e) => {
        let eles = e.composedPath();
        for (let i = 0; i < eles.length; i++) {
          let el = eles[i];
          if (el.dataset && el.dataset.astId) {
            let vucNode = this.getVucNode(el.dataset.astId);
            if (this.handlerHook('onBeforeSelectNode', getNodeHook(vucNode, 'onBeforeSelectNode'), vucNode)) {
              continue;
            }

            this.hoverVucNode = vucNode;
            this.hoverVucNodeEl = el;
            return;
          }
        }
        this.hoverVucNode = null;
        this.hoverVucNodeEl = null;
      });
    },

    bindSelectEvent() {
      this.addEvent('click', (event, vucNode, curElement) => {
        if (this.handlerHook('onBeforeSelectNode', getNodeHook(vucNode, 'onBeforeSelectNode'), vucNode)) {
          return;
        }
        this.selectVucNode(vucNode, curElement);
        return true;
      });
    },

    bindContextmenuEvent() {
      this.addEvent('contextmenu', (event, vucNode) => {
        if (this.handlerHook('onBeforeSelectNode', getNodeHook(vucNode, 'onBeforeSelectNode'), vucNode)) {
          return;
        }
        this.selectVucNode(vucNode);
        this.showMenu(event);
        event.preventDefault();
        event.stopPropagation();
        return true;
      });
    },

    getDropPosInfo(event, curVucNode, curElement) {
      if (!this.dropManager.isDrop) return;
      let posInfo = this.dropManager.getRelativePosInfo(event, { node: curVucNode, el: curElement }, this);
      if (!posInfo) return;
      if (!this.dropManager.dropLimit(posInfo)) {
        return;
      }
      if (this.handlerHook('onDragdrop', undefined, this.dropManager.dropData, posInfo.targetNode, posInfo.pos)) {
        return;
      }
      return posInfo;
    },

    bindDropmoveEvent() {
      this.addEvent('mousemove', (event, curVucNode, curElement) => {
        let posInfo = this.getDropPosInfo(event, curVucNode, curElement);
        if (!posInfo) return;

        if (posInfo.pos === 'inner') {
          let rect = posInfo.el.getBoundingClientRect();
          this.dropManager.proxyPosElementStyle = {
            width: rect.width + 'px',
            height: rect.height + 'px',
            top: rect.top + 'px',
            left: rect.left + 'px',
            opacity: 0.2,
          };
        } else {
          this.dropManager.proxyPosElementStyle = Object.assign({ opacity: 0.7 }, posInfo.rect.getStyle(posInfo.pos));
        }
        event._stopMove = true;
        return true;
      });
    },

    bindDropupEvent() {
      this.addEvent('mouseup', (event, curVucNode, curElement) => {
        let posInfo = this.getDropPosInfo(event, curVucNode, curElement);
        if (!posInfo) return;

        event._stopUp = true;
        if (posInfo.isNotMove) return true;

        this.dropManager.getDropVucNode(posInfo).then((dropVucNode) => {
          dropVucNode.delSlot();
          if (posInfo.pos === 'inner') {
            this.insertToSlot(curVucNode, posInfo.slot, dropVucNode);
          } else {
            let targetNode = posInfo.rect.data;
            let p = posInfo.pos === 'r' || posInfo.pos === 'b' ? 'after' : 'before';
            this.insertNode(targetNode, p, dropVucNode);
          }
        });

        return true;
      });
    },

    dropStart(event, dropData, dropProxyInfo) {
      this.dropManager.dropStart(event, dropData, dropProxyInfo);
    },

    addEvent(eventName, callback) {
      let wrapEvent = (e) => {
        let eles = e.composedPath();

        for (let i = 0; i < eles.length; i++) {
          let el = eles[i];
          if (el.dataset && el.dataset.astId) {
            let vucNode = this.getVucNode(el.dataset.astId);
            if (callback(e, vucNode, el)) {
              return;
            }
          }
        }
      };

      document.body.addEventListener(eventName, wrapEvent);

      this.__events__ = this.__events__ || {};
      let events = (this.__events__[eventName] = this.__events__[eventName] || []);
      events.push(wrapEvent);
    },
  },

};
