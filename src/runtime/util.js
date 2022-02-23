import { makeMap } from '@/helpers/lang';
import VucNode from './VucNode';
import { parseAst } from './vue-template-compiler/compile';

const DIR_NAME_MAP = { bind: ':', on: '@', slot: '#' };

const PROP_TYPE_MAP = {
  NOT_CONSTANT: 0,
  TEXT: 2,
  CAN_STRINGIFY: 3,
  SIMPLE_EXPRESSION: 4,
  ATTRIBUTE: 6,
  DIRECTIVE: 7,
  JS_CALL_EXPRESSION: 14,
  JS_OBJECT_EXPRESSION: 15,
};

const tagTypeMap = {
  ELEMENT: 0,
  COMPONENT: 1,
  SLOT: 2,
  TEMPLATE: 3,
};

const typeMap = {
  ELEMENT: 1,
  TEXT: 2,
  INTERPOLATION: 5,
  IF: 9,
  IF_BRANCH: 10,
  FOR: 11,
  TEXT_CALL: 12,
  VNODE_CALL: 13,
};

function startsWith(str, withs) {
  return str.startsWith(withs);
}

function removeLoc(prop) {
  if (Array.isArray(prop)) {
    return prop.map(removeLoc);
  }

  if (typeof prop == 'object') {
    let o = {};
    for (let k in prop) {
      if (k !== 'loc') o[k] = removeLoc(prop[k]);
    }
    return o;
  }

  return prop;
}

function parseAttrName(name) {
  if (/^(v-|:|@|#)/.test(name)) {
    const match = /(?:^v-([a-z0-9-]+))?(?:(?::|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(name);
    const dirName = match[1] || (startsWith(name, ':') ? 'bind' : startsWith(name, '@') ? 'on' : 'slot');
    let arg;
    if (match[2]) {
      const isSlot = dirName === 'slot';
      let content = match[2];
      let isStatic = true;
      if (content.startsWith('[')) {
        isStatic = false;
        content = content.substr(1, content.length - 2);
      } else if (isSlot) {
        content += match[3] || '';
      }
      arg = {
        type: 4 /* SIMPLE_EXPRESSION */,
        content,
        isStatic,
        constType: isStatic ? 3 /* CAN_STRINGIFY */ : 0 /* NOT_CONSTANT */,
      };
    }
    return {
      type: 7 /* DIRECTIVE */,
      name: dirName,
      arg,
      modifiers: match[3] ? match[3].substr(1).split('.') : [],
    };
  }
  return {
    type: 6 /* ATTRIBUTE */,
    name,
  };
}

function parseAttr(name, value) {
  let obj = parseAttrName(name);
  if (obj.type === PROP_TYPE_MAP.DIRECTIVE) {
    obj.exp = value && {
      type: 4 /* SIMPLE_EXPRESSION */,
      content: value,
      isStatic: false,
      constType: 0 /* NOT_CONSTANT */,
    };

    return obj;
  }

  obj.value = value && {
    type: 2 /* TEXT */,
    content: value,
  };

  return obj;
}

const isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
);

function createVucNode(template) {
  const node = parseAst(template).children[0];
  return new VucNode(node);
}

function isVucNode(node) {
  return node instanceof VucNode;
}

export { PROP_TYPE_MAP, DIR_NAME_MAP, parseAttrName, parseAttr, removeLoc, isHTMLTag, createVucNode, isVucNode };
