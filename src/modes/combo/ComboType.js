import { parseTemplate } from './util';
import { formatComponentName } from '@/helpers/lang';
import Combo from './Combo';

class ComboType {
  constructor(options) {
    Object.assign(this, options);
    this.rootNode = parseTemplate(options.template);
  }

  createCombo(vNode) {
    let nodeMap;
    let nodeConfigMap;
    let match = getMatch([this.rootNode], [vNode]);
    if (match) {
      nodeMap = { [this.rootNode.key]: vNode };
      nodeConfigMap = { [vNode._astId]: this.rootNode };
      if (childrenSame(this.rootNode, vNode)) {
        return new Combo(this, vNode, nodeMap, nodeConfigMap);
      }
    }

    function isEmpty(children) {
      return children == null || children.length == 0;
    }

    function childrenSame(cNode, vNode) {
      if (isEmpty(cNode.children)) {
        return isEmpty(vNode.children) || cNode.allowChildren;
      }
      let match = getMatch(cNode.children, vNode.children);
      if (match) {
        for (let i = 0; i < cNode.children.length; i++) {
          if (!match[i + 1]) continue;
          let id = getID(match[i + 1]);
          let cn = cNode.children[i];
          let vn = vNode.children.find((vn) => vn._astId == id);
          nodeConfigMap[vn._astId] = cn;

          if (cn.key) {
            nodeMap[cn.key] = vn;
          }
          if (!childrenSame(cn, vn)) {
            return false;
          }
        }

        return true;
      }
      return false;
    }

    function getMatch(cNodes, vNodes) {
      let RE = createREs(cNodes || []);
      let str = createStrs(vNodes || []);
      return str.match(RE);
    }
  }
}

function getID(str) {
  let m = str.match(/id="(.*?)"/);
  return m ? m[1] : undefined;
}

function createREs(cNodes) {
  return new RegExp('^' + cNodes.map(createRE).join('') + '$');
}

function createRE(cNode) {
  let reStr = '';
  if (cNode.tag.startsWith('type.')) {
    reStr = `(<.[^<>]*class="${cNode.selector}".*[^<>]*>)`;
  } else if (cNode.tag == 'any') {
    reStr = `(<.[^<>]*>)`;
  } else {
    reStr = `(<${formatComponentName(cNode.selector)}.*[^<>]*>)`;
  }

  let num = parseInt(cNode.num);
  if (isNaN(num)) {
    reStr += cNode.num;
  } else if (cNode.num !== 1) {
    reStr += `{${num}}`;
  }

  return reStr;
}

function createStrs(vNodes) {
  return vNodes.map(createStr).join('');
}

function createStr(vNode) {
  if (vNode.isText()) {
    return '<text>';
  }
  let config = vNode.getConfig();
  let tag = vNode.tag;
  if (!config) return `<${tag} id="${vNode._astId}">`;
  let types = '';
  if (config.type) {
    types = config.type.map((t) => ` class="${t}"`).join('');
  }

  return `<${tag} id="${vNode._astId}"${types}>`;
}

export default ComboType;
