import minBy from 'lodash-es/minBy';
import DropRect from '@/helpers/DropRect';
import { createVucNode, isVucNode } from '@/helpers/vucNodeHelper';
import { isFunction, isString } from '@/helpers/lang';
import { getVucConfig } from '@/config';

//拖拽时禁止选中
function noSelection(e) {
  e.preventDefault();
}

export class DropManager {
  constructor() {
    this.isDrop = false;
  }

  //开始拖拽
  dropStart(event, dropData, dropProxyInfo) {
    if (event._stopStartDrop) return;
    this.dropEvent = event;
    this.dropData = dropData;
    this.dropProxyInfo = dropProxyInfo;
    event._stopStartDrop = true;

    let move = (e) => {
      return this.showProxy(e);
    };

    let up = (e) => {
      window.removeEventListener('selectstart', noSelection);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      return this.removeProxy(e);
    };

    window.addEventListener('selectstart', noSelection);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  showProxy(curEvent) {
    let dropEvent = this.dropEvent;

    if (!dropEvent.first) {
      if (
          curEvent.timeStamp - dropEvent.timeStamp < 500 &&
          Math.abs(curEvent.pageX - dropEvent.pageX) < 10 &&
          Math.abs(curEvent.pageY - dropEvent.pageY) < 10
      ) {
        return;
      } else {
        dropEvent.first = true;
      }
    }

    if (this.isDrop === false) {
      this.isDrop = true;
      document.body.classList.add('vuc-draging');
    }

    if (this.proxyElement == null) {
      this.proxyElement = document.createElement('div');
      this.proxyElement.className = 'vuc-drag-proxy';
      document.body.appendChild(this.proxyElement);
    }

    if (this.proxyPosElement == null) {
      this.proxyPosElement = document.createElement('div');
      this.proxyPosElement.className = 'vuc-pos-proxy';
      document.body.appendChild(this.proxyPosElement);
    }

    if (curEvent._stopMove) {
      Object.assign(this.proxyPosElement.style, this.proxyPosElementStyle, { display: 'block' });
    } else {
      Object.assign(this.proxyPosElement.style, { display: 'none' });
    }

    Object.assign(this.proxyElement.style, {
      left: curEvent.clientX - this.dropProxyInfo.x + 'px',
      top: curEvent.clientY - this.dropProxyInfo.y + 'px',
      width: this.dropProxyInfo.width,
      height: this.dropProxyInfo.height,
    });
  }

  removeProxy(e) {
    document.body.classList.remove('vuc-draging');
    this.isDrop = false;
    this.dropData = null;
    this.dropProxyInfo = null;
    this.dropEvent = null;
    if (this.proxyElement) {
      document.body.removeChild(this.proxyElement);
      this.proxyElement = null;
    }
    if (this.proxyPosElement) {
      document.body.removeChild(this.proxyPosElement);
      this.proxyPosElement = null;
    }
  }

  isOffspring(curVucNode) {
    return this.dropIsVucNode() && this.dropData.node.isOffspring(curVucNode);
  }

  getSlotInfo(event, cur) {
    let curVucNode = cur.node,
        curVucNodeElement = cur.el;

    let config = curVucNode.getConfig();

    if (config && config.slots) {
      let _slot = null;
      config.slots.find((slot) => {
        if (slot.selector) {
          let el = curVucNodeElement.querySelector(slot.selector);
          if (event.path.indexOf(el) != -1) {
            return ( _slot = Object.assign({ el }, slot) );
          }
        }
      });

      if (!_slot) {
        let slot = config.slots.find((slot) => slot.slot == 'default');
        if (slot && !slot.selector) {
          _slot = Object.assign({ el: cur.el }, slot);
        }
      }

      return _slot;
    }

    return false;
  }

  getRelativePosInfo(event, cur, editor) {
    if (this.isOffspring(cur.node)) {
      return;
    }

    let dropNode = null;
    let dropAstId;

    if (this.dropIsVucNode()) {
      dropNode = this.dropData.node;
      dropAstId = dropNode._astId;
    }

    function getInnerPos(slot, el) {
      let rect = createRect(cur.node, cur.el);
      let pos = rect.getInsidePos(event.pageX, event.pageY);
      let value = rect.isBlock ? rect.height : rect.width;
      pos.rect = rect;
      if (pos.value < value / 5 && pos.value < 10) {
        return pos;
      }

      return {
        pos: 'inner',
        rect,
        slot,
        el,
      };
    }

    function getOtherPos(slot, eles) {
      let rects = eles
          .filter((el) => el.dataset.astId !== dropAstId)
          .map((el) => {
            let vucNode = editor.getVucNode(el.dataset.astId);
            return createRect(vucNode, el);
          });

      let pos = computedPos(
          {
            x: event.pageX,
            y: event.pageY,
          },
          rects,
      );

      if (pos) {
        pos.slot = slot;
      }

      return pos;
    }

    let pos;

    // 放置到HTML对象上
    if (cur.node.isHTML()) {
      if (cur.el.childElementCount === 0) {
        if (cur.node.tag == 'img') {
          return;
        }
        pos = getInnerPos('default', cur.el);
      } else {
        let els = [];
        for(let el of cur.el.children) {
          els.push(el);
        }
        pos = getOtherPos('default', els);
        this.markNotMove(pos);
      }
    }
    //放置到组件上
    else {
      let slotConfig = this.getSlotInfo(event, cur);
      if (slotConfig) {
//        let vueInstances = editor.findVucInstancesById(cur.node._astId) || [];
//        let vueInstance = vueInstances.find((vm) => vm.$el === cur.el);
        // 找到组件插槽下的所有子元素

        let vucNode = editor.vucAst.getVucNodeByAstId(cur.node._astId);
        let ns = vucNode.getSlotNodes(slotConfig.slot);
        let eles = ns.flatMap(n => {
          return document.querySelector(`[data-ast-id="${ n._astId }"]`);
        }).filter(e => e);


        if (!eles || eles.length === 0) {
          pos = getInnerPos(slotConfig.slot, slotConfig.el);
        } else {
          pos = getOtherPos(slotConfig.slot, eles);
          if (!pos) return;

          //计算和父容器重合的情况下，距离谁更近
          let parentPos = computedPos(
              {
                x: event.pageX,
                y: event.pageY,
              },
              [createRect(cur.node, cur.el)],
          );

          if (parentPos && parentPos.value < 10 && parentPos.value < pos.value) {
            pos = parentPos;
          }

          this.markNotMove(pos);
        }
      } else {
        pos = getOtherPos('', [cur.el]);
        //未配置slot时，且移动到在当前组件的内部
        if (!pos || !pos.inside) return;
      }
    }

    let targetNode = pos.rect.data;
    let parentNode = pos.pos == 'inner' ? targetNode : targetNode.getParentNode();

    pos.targetNode = targetNode;
    pos.parentNode = parentNode;

    return pos;
  }

  getDropVucNode(posInfo) {
    let node = this.dropData.node;

    return new Promise((resolve) => {
      if (isFunction(node)) {
        let result = node.call(null, posInfo, exec);
        if (!result) return;
        if (result instanceof Promise) {
          result.then((rs) => {
            exec(rs);
          });
        } else {
          exec(result);
        }
      } else {
        exec(node);
      }

      function exec(data) {
        let vucNode;
        if (isVucNode(data)) {
          vucNode = data;
        } else if (isString(data)) {
          vucNode = createVucNode(data);
        }
        resolve(vucNode);
      }
    });
  }

  dropLimit(posInfo) {
    let { parentNode, targetNode, pos } = posInfo;

    if (!parentNode) return false;

    let dropTag;
    if (this.dropIsVucNode()) {
      dropTag = this.dropData.node.tag;
    } else if (this.dropData.tag) {
      dropTag = this.dropData.tag;
      if (isFunction(dropTag)) {
        dropTag = dropTag.call(null, posInfo);
      }
    }

    if (!dropTag) return false;

    //被放置的目标，可以放置什么东西
    let childLimit = parentNode.getConfig('childLimit');
    if (childLimit && childLimit(dropTag, this.dropIsVucNode() && this.dropData.node) === false) {
      return false;
    }

    let dropConfig = getVucConfig(dropTag);

    //被拖拽的目标，可以放置什么地方
    if (dropConfig?.parentLimit && dropConfig.parentLimit(parentNode) === false) {
      return false;
    }

    return true;
  }

  dropIsVucNode() {
    return isVucNode(this.dropData?.node);
  }

  markNotMove(pos) {
    if (!this.dropIsVucNode() || !pos) return;
    let targetNode = pos.rect.data;
    let dropNode = this.dropData.node;

    if (targetNode.getSlotName() == dropNode.getSlotName()) {
      let posNode;
      if (pos.pos === 'r' || pos.pos === 'b') {
        posNode = targetNode.getAfterNode();
      } else if (pos.pos === 'l' || pos.pos === 't') {
        posNode = targetNode.getBeforeNode();
      }
      if (dropNode && posNode === dropNode) {
        pos.isNotMove = true;
      }
    }
  }
}

function getSlotEles(vucAst, astId, slot) {
  if (vue && vue.$slots && vue.$slots[slot]) {
    let vnodes = vue.$slots[slot]();
    let eles = [];
    vnodes.forEach((vnode) => {
      let dir = vnode.dirs && vnode.dirs.find((dir) => dir.dir?.name === 'astId');
      if (dir) {
        eles.push(vue.$el.querySelector(`*[data-ast-id='${ dir.value }']`));
      }
    });

    return eles;
  }
}

function createRect(node, el) {
  return new DropRect(el.getBoundingClientRect(), node, el);
}

function computedPos(point, rects, distance = 20) {
  let rect = rects.find((rect) => {
    return rect.isInside(point.x, point.y);
  });

  if (rect) {
    return rect.getInsidePos(point.x, point.y);
  }

  let posArr = rects.map((rect) => rect.getPosDis(point.x, point.y)).filter((o) => o.value >= 0);
  let pos = minBy(posArr, 'value');
  if (pos) return pos;

  // 处理空白区域情况
  rect = rects.find((rect) => rect.y1 >= point.y);
  if (rect) {
    return {
      rect,
      pos: 'l',
      value: point.y - rect.y1,
    };
  }

  rect = rects[rects.length - 1];
  if (point.y > rect.y2) {
    return {
      rect,
      pos: 'r',
      value: point.y - rect.y2,
    };
  }

  // 处理空白区域情况
  //  for(let i = 0; i < rects.length; i++) {
  //    let rect = rects[i];
  //    let nextRect = rects[i + 1];
  //    if (rect.y1 >= point.y) {
  //      if (point.x <= rect.x1) {
  //        return {
  //          rect,
  //          pos: 'l',
  //          value: rect.x1 - point.x,
  //        };
  //      } else if (point.x <= rect.x2) {
  //        return f(rect.x2 - point.x, point.x - rect.x1, rect);
  //      } else if (nextRect && point.x < nextRect.x1) {
  //        return f(point.x - rect.x2, nextRect.x1 - point.x, rect);
  //      }
  //    }
  //
  //  }

  return;
}

export default DropManager;
