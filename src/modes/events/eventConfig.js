export const NATIVE_EVENTS = [
  {
    name: '鼠标事件',
    events: [
      {
        id: 'click',
        name: '点击',
        mouseModifier: true,
      },
      {
        id: 'dblclick',
        name: '双击事件',
        mouseModifier: true,
      },
      {
        id: 'mousedown',
        name: '鼠标按钮按下',
        mouseModifier: true,
      },
      {
        id: 'mouseup',
        name: '鼠标按钮释放',
        mouseModifier: true,
      },
      {
        id: 'mousemove',
        name: '鼠标移动',
      },
      {
        id: 'mouseover',
        name: '鼠标移入',
      },
      {
        id: 'mouseout',
        name: '鼠标移出',
      },
      {
        id: 'mousewheel',
        name: '滚轮滚动',
      },
      {
        id: 'scroll',
        name: '滚动条滚动',
      },
    ],
  },
  {
    name: '表单事件',
    events: [
      {
        id: 'blur',
        name: '失去焦点',
      },
      {
        id: 'change',
        name: '内容改变',
      },
      {
        id: 'contextmenu',
        name: '上下文菜单',
      },
      {
        id: 'focus',
        name: '获得焦点',
      },
      {
        id: 'input',
        name: '输入',
      },
      {
        id: 'submit',
        name: '提交表单',
      },
      {
        id: 'select',
        name: '文本被选中',
      },
    ],
  },
  {
    name: '键盘事件',
    events: [
      {
        id: 'keydown',
        name: '按下按键',
        keyModifier: true,
      },
      {
        id: 'keypress',
        name: '敲击按键',
        keyModifier: true,
      },
      {
        id: 'keyup',
        name: '释放按键',
        keyModifier: true,
      },
    ],
  },
  {
    name: '其他',
    events: [
      {
        id: 'load',
        name: '加载成功',
      },
      {
        id: 'error',
        name: '发生错误',
      },
    ],
  },
];

export const EVENT_MODIFIERS = [
  {
    id: 'stop',
    name: '阻止事件继续传播',
  },
  {
    id: 'prevent',
    name: '阻止事件默认行为',
  },
  {
    id: 'capture',
    name: '使用捕获模式',
  },
  {
    id: 'self',
    name: '只当事件发生在当前元素时',
  },
  {
    id: 'once',
    name: '只触发一次',
  },
  {
    id: 'passive',
    name: '提升移动端滚动性能',
  },
];

export const KEY_MODIFIERS = [
  {
    id: 'enter',
  },
  {
    id: 'tab',
  },
  {
    id: 'delete',
  },
  {
    id: 'esc',
  },
  {
    id: 'space',
  },
  {
    id: 'up',
  },
  {
    id: 'down',
  },
  {
    id: 'left',
  },
  {
    id: 'right',
  },
];

export const SYS_MODIFIERS = [
  {
    id: 'ctrl',
  },
  {
    id: 'alt',
  },
  {
    id: 'shift',
  },
  {
    id: 'meta',
  },
  {
    id: 'exact',
  },
];

export const MOUSE_MODIFIERS = [
  {
    id: 'left',
  },
  {
    id: 'right',
  },
  {
    id: 'middle',
  },
];

export function getHtmlEvents() {
  return NATIVE_EVENTS;
}

export function getComponentEvents(events) {
  let ids = events.map((event) => event.id);
  return NATIVE_EVENTS.map((group) => {
    return {
      name: group.name,
      events: group.events
        .map((event) => Object.assign({}, event, { id: event.id, label: event.id }))
        .filter((e) => !ids.includes(e.id)),
    };
  });
}

let onRE = /^@|^v-on:/;
let modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

export function processEvent(name) {
  let event = {
    id: '',
    code: '',
    modifiers: [],
    sysModifiers: [],
    keyModifier: undefined,
    mouseModifier: undefined,
  };
  let modifiers = name.match(modifierRE);
  if (modifiers) {
    name = name.replace(modifierRE, '');
  }

  if (onRE.test(name)) {
    name = name.replace(onRE, '');
  }

  if (modifiers) {
    let eventConfig = NATIVE_EVENTS.flatMap((group) => group.events).find((event) => event.id == name);

    modifiers.forEach((modifier) => {
      modifier = modifier.substring(1);

      /*if (modifier == 'native') {
        name += '.native';
      }*/

      if (isModifier(EVENT_MODIFIERS, modifier)) {
        event.modifiers.push(modifier);
      }

      if (eventConfig.keyModifier) {
        if (isModifier(KEY_MODIFIERS, modifier)) {
          event.keyModifier = modifier;
        }
      } else {
        if (isModifier(MOUSE_MODIFIERS, modifier)) {
          event.mouseModifier = modifier;
        }
      }

      if (isModifier(SYS_MODIFIERS, modifier)) {
        event.sysModifiers.push(modifier);
      }
    });
  }

  event.id = name;

  return event;
}

export function isEventAttr(name) {
  return onRE.test(name);
}

function isModifier(modifiers, modifier) {
  return modifiers.find((m) => m.id == modifier);
}

export function getEvents(attrsMap) {
  const events = [];
  for(let k in attrsMap){
    if (isEventAttr(k)) {
      let v = attrsMap[k];
      let event = processEvent(k);
      event.code = v;
      event.key = k;
      events.push(event);
    }
  }
  return events;
}

export function defaultEvent(event) {
  return Object.assign(
    {
      id: '',
      code: '',
      modifiers: [],
      sysModifiers: [],
      keyModifier: undefined,
      mouseModifier: undefined,
    },
    event
  );
}

export function formatEventName(event) {
  let path = [event.id, event.keyModifier, event.mouseModifier].concat(event.modifiers).concat(event.sysModifiers);
  return '@' + path.filter((m) => m).join('.');
}
