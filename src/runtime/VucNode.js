import { getVucConfig } from '@/config/vucConfig';
import { formatComponentName, camelize, kebabCase, isString, castArray, isFunction } from '@/helpers/lang';
import { removeLoc, isHTMLTag, parseAttr, createVucNode } from './util';
import VucNodeAttr from './VucNodeAttr';

let index = 1;

class VucNode {
  constructor(node, parent) {
    this.type = node.type;

    if (this.isText()) {
      if (this.type == 5) {
        this.content = '{{ ' + node.content.content + ' }}';
      } else {
        this.content = node.content;
      }
      this.props = [];
    } else {
      this.rawTag = node.tag;
      this.tag = formatComponentName(this.rawTag);
      this.kebabTag = kebabCase(this.tag);
      this.tagType = node.tagType;
      this.props = node.props.map((p) => new VucNodeAttr(removeLoc(p)));
      this.children = node.children
          .filter((child) => child.type !== 3 && !( child.type === 2 && child.content == ' ' ))
          .map((child) => {
            if (child instanceof VucNode) {
              child.parent = this;
              return child;
            }
            return new VucNode(child, this);
          });
    }

    this._astId = `ast_${ index++ }`;

    defineNotEnumerProperty(this, 'parent', parent);
    defineNotEnumerProperty(this, '_changeCount', 0);
    defineNotEnumerProperty(this, 'name', this.getConfig('name', this.rawTag));

    this.updateKey();
  }

  setAttrValue(name, value) {
    let attr = new VucNodeAttr(parseAttr(name, value));
    if (attr.isBind()) {
      return this._setBind(attr);// && this.updateKey();
    }

    let old = this.getDirective(attr.name, attr.isMultipleDirective() ? attr.getArgContent() : undefined);
    if (attr.eq(old)) return false;
    this._setAttr(attr, old);

//    if (!attr.isEvent() && !attr.isSolt()) {
//      this.updateKey();
//     }

    return true;
  }

  _pushAttr(attr) {
    this.props.push(attr);
    this.triggerAttrChange(attr, null);
  }

  _spliceAttr(nameOrIndex, ...attr) {
    let index;
    if (isString(nameOrIndex)) {
      let attr = new VucNodeAttr(parseAttr(nameOrIndex));
      if (attr.isBind()) {
        attr = this.getBind(nameOrIndex);
      } else {
        attr = this.getAttr(nameOrIndex);
      }
      index = this.props.indexOf(attr);
    } else if (Number.isInteger(nameOrIndex)) {
      index = nameOrIndex;
    } else {
      index = this.props.indexOf(nameOrIndex);
    }
    if (index > -1) {
      let [oldValue] = this.props.splice(index, 1, ...attr);
      this.triggerAttrChange(attr[0], oldValue);
    }
    return index;
  }

  triggerAttrChange(attr, oldAttr) {
    if (( attr || oldAttr ).isBind()) {
      let props = this.getConfig('props');
      let prop = props && props[( attr || oldAttr ).getBindName()];
      if (prop && prop.change) {
        castArray(prop.change).forEach((change) => ( isFunction(change) ? change(attr, oldAttr, this) : null ));
      }
    }
  }

  _pushChildren(...items) {
    items.forEach((item) => {
      this.children.push(item);
    });
  }

  _spliceChildren(index, howmany, ...items) {
    this.children.splice(index, howmany, ...items);
  }

  _setBind(attr) {
    let isStaticBind = attr.isStaticBind();
    let name = attr.getBindName();
    let oldStaticBind = this.getStaticBind(name);
    let oldBind = this.getVBind(name);

    let old = isStaticBind ? oldStaticBind : oldBind;
    let otherOld = isStaticBind ? oldBind : oldStaticBind;

    if (old) {
      if (old.valueEq(attr)) return false;
    } else {
      old = otherOld;
    }

    this._setAttr(attr, old);

    return true;
  }

  _setAttr(attr, old) {
    if (old) {
      this._spliceAttr(old, attr);
    } else {
      this._pushAttr(attr);
    }
  }

  delAttr(nameOrIndex) {
    return this._spliceAttr(nameOrIndex) != -1;
  }

  getAttr(name) {
    let attr = new VucNodeAttr(parseAttr(name));
    return this.props.find((p) => attr.attrName === p.attrName);
  }

  getAttrValue(name) {
    let prop = this.getAttr(name);
    return prop && prop.attrValue;
  }

  getDirectives() {
    return this.props.filter((prop) => {
      return prop.isDirective() && !prop.isVBind() && !prop.isEvent() && !prop.isSolt();
    });
  }

  getDirective(name, arg) {
    return this.props.find((prop) => {
      return prop.isDirective() && prop.name === name && ( arg ? prop.getArgContent() === arg : true );
    });
  }

  getBind(name) {
    name = camelize(name);
    return this.props.find((prop) => {
      return prop.isBind() && prop.getBindName() === name;
    });
  }

  getStaticBind(name) {
    name = camelize(name);
    return this.props.find((prop) => {
      return prop.isStaticBind() && prop.getBindName() === name;
    });
  }

  getVBind(name) {
    name = camelize(name);
    return this.props.find((prop) => {
      return prop.isVBind() && prop.getBindName() === name;
    });
  }

  getEvent(arg) {
    return this.getOn(arg);
  }

  getOn(arg) {
    return this.getDirective('on', arg);
  }

  getSlot() {
    return this.getDirective('slot');
  }

  delSlot() {
    let slot = this.getSlot();
    this.delAttr(slot);
  }

  getSlotName() {
    let slot = this.getSlot();
    return slot && slot.getArgContent();
  }

  getSlotParam() {
    let slot = this.getSlot();
    return slot && slot.getExpContent();
  }

  getBelongSlotName() {
    let parentNode = this.getParentNode();
    if (!parentNode || parentNode.isHTML()) return;

    let slotName = this.getSlotName();
    if (!slotName && this.parent.tag === 'template') {
      slotName = this.parent.getSlotName();
    }
    return slotName || 'default';
  }

  isText() {
    return this.type === 2 || this.type === 5;
  }

  getAttrMap() {
    let map = {};
    this.props &&
    this.props.forEach((attr) => {
      map[attr.attrName] = attr.attrValue;
    });
    return map;
  }

  getAttrsStr() {
    return this.props.join(' ');
  }

  updateKey() {
    this._key = this._astId + '_' + ++this._changeCount;
    return true;
  }

  getIndex() {
    return this.parent ? this.parent.getChildIndex(this) : -1;
  }

  getChildIndex(child) {
    return this.children ? this.children.indexOf(child) : -1;
  }

  getChild(index) {
    return this.children[index];
  }

  getBeforeNode() {
    const index = this.getIndex();
    if (this.parent) {
      return this.parent.getChild(index - 1);
    }
  }

  getAfterNode() {
    const index = this.getIndex();
    if (this.parent) {
      return this.parent.getChild(index + 1);
    }
  }

  getParentNode() {
    if (this.parent) {
      if (this.parent.tag !== 'template') {
        return this.parent;
      }
      if (this.parent.parent && this.parent.parent.tag !== 'template') {
        return this.parent.parent;
      }
    }
  }

  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  removeChild(child) {
    const dropIndex = this.getChildIndex(child);
    this._spliceChildren(dropIndex, 1);
  }

  insertNode(node, index) {
    if (node.parent === this) {
      if (node.getIndex() + 1 < index) {
        index--;
      }
    }
    node.remove();
    node.parent = this;
    this._spliceChildren(index, 0, node);
  }

  insertNodes(nodes, index) {
    if (isString(nodes)) {
      nodes = createVucNode(nodes);
    }

    nodes = castArray(nodes);
    nodes.forEach((node) => {
      if (node.parent === this) {
        if (node.getIndex() + 1 < index) {
          index -= nodes.length;
        }
      }
      node.remove();
      node.parent = this;
    });
    this._spliceChildren(index, 0, ...nodes);
  }

  appendNode(nodes) {
    if (isString(nodes)) {
      nodes = createVucNode(nodes);
    }

    castArray(nodes).forEach((node) => {
      node.remove();
      node.parent = this;
      this._pushChildren(node);
    });
  }

  insertBefore(beforeNode) {
    const index = this.getIndex();
    this.parent.insertNodes(beforeNode, index);
  }

  insertAfter(afterNode) {
    const index = this.getIndex();
    this.parent.insertNodes(afterNode, index + 1);
  }

  insertToSlot(insertNode, slot) {
    const node = this;
    const slotNode = node.children.find((child) => {
      return child.getSlotName() == slot;
    });

    if (slotNode) {
      if (slotNode.tag === 'template') {
        slotNode.appendNode(insertNode);
      } else {
        const index = slotNode.getIndex();
        slotNode.remove();
        slotNode.delSlot();
        insertNode.remove();
        insertNode.delSlot();

        const template = createTemplateSlot(slot, undefined, [slotNode, insertNode]);
        this.insertNode(template, index);
      }
    } else {
      let config = this.getConfig('slots', []).find((s) => s.slot == slot);
      let scope = config?.scope;
      if (slot === 'default' && !scope) {
        insertNode.delSlot();
        if (insertNode.parent !== node) {
          this.appendNode(insertNode);
        }
      } else {
        insertNode.remove();
        insertNode.delSlot();
        const template = createTemplateSlot(slot, scope, [insertNode]);
        this.appendNode(template);
      }
    }
  }

  moveToBefore() {
    const beforeNode = this.getBeforeNode();
    if (beforeNode) {
      beforeNode.insertBefore(this);
    }
  }

  moveToAfter() {
    const afterNode = this.getAfterNode();
    if (afterNode) {
      this.insertAfter(this);
    }
  }

  moveToSlot(slot) {
    const parent = this.getParentNode();
    parent.insertToSlot(this, slot);
  }

  isEmpty() {
    return this.children.length === 0;
  }

  empty() {
    this._spliceChildren(0, this.children.length);
  }

  eqTag(tag) {
    return formatComponentName(tag) === this.tag;
  }

  setStyle(style, dynamic = false) {
    let setKey = dynamic ? ':style' : 'style';
    this.setAttrValue(setKey, style);
  }

  setText(content, type = 2) {
    if (this.isText()) {
      this.content = content;
    } else {
      let textNode = new VucNode({ content, type }, this);
      let index = this.children.findIndex((child) => child.isText());
      if (index == -1) {
        this.appendNode(textNode);
      } else {
        this._spliceChildren(index, 1, textNode);
      }
    }
  }

  getText() {
    if (this.isText()) {
      return this.content;
    }
    return this.children
        .map((child) => ( child.isText() ? child.getText() : '' ))
        .join('')
        .trim();
  }

  clone() {
    return createVucNode(this.toTemplate());
  }

  closest(selector) {
    let temp = this;
    while (temp.parent) {
      if (temp.parent.test(selector)) {
        return temp.parent;
      }
      temp = temp.parent;
    }
  }

  getParents() {
    let node = this;
    let parents = [];
    while (node.parent) {
      parents.push(node.parent);
      node = node.parent;
    }
    return parents;
  }

  eachAllNode(iterator) {
    function loop(node) {
      iterator(node);
      if (node.children) node.children.forEach(loop);
    }

    loop(this);
  }

  //深度优先
  dfs(iterator, self) {
    let children = [];
    if (self) {
      children.push(this);
    }
    children = children.concat(this.children);

    while (children.length) {
      let child = children.shift();
      let state = iterator(child);

      //中断搜索
      if (state === -1) {
        return child;
      }

      //不继续搜索子节点
      if (state === 0) {
        continue;
      }

      if (child.children) {
        children = [].concat(child.children).concat(children);
      }
    }
  }

  //广度优先
  bfs(iterator, self) {
    let children = [];
    if (self) {
      children.push(this);
    }
    children = children.concat(this.children);

    while (children.length) {
      let child = children.shift();
      let state = iterator(child);

      //中断搜索
      if (state === -1) {
        return child;
      }

      //不继续搜索子节点
      if (state === 0) {
        continue;
      }

      if (child.children) {
        children = children.concat(child.children);
      }
    }
  }

  querySelector(selector, self) {
    let it = getFindPredicate(selector);
    return this.bfs((child) => ( it(child) ? -1 : undefined ), self);
  }

  querySelectorAll(selector, self) {
    let it = getFindPredicate(selector);
    let nodes = [];
    this.bfs((child) => {
      if (it(child)) {
        nodes.push(child);
      }
    }, self);
    return nodes;
  }

  getSlotNodes(slot) {
    let ns = [];
    this.children.forEach(n => {
      if (n.getBelongSlotName() == slot) {
        if (n.isTemplateNode()) {
          ns = ns.concat(n.children);
        } else {
          ns.push(n);
        }
      }
    });

    return ns;
  }

//  findChildrenDeep(selector) {
//    let it = getFindPredicate(selector);
//    let array = [];
//
//    this.bfs((child) => {
//      if (it(child)) {
//        array.push(child);
//      }
//    });
//
//    return array;
//  }

  findChild(selector) {
    let it = getFindPredicate(selector);
    return this.children.find(it);
  }

  findChildren(selector) {
    let it = getFindPredicate(selector);
    return this.children.filter(it);
  }

  getConfig(key, defaultValue) {
    let config = getVucConfig(this.tag);
    if (key) {
      return config && config.hasOwnProperty(key) ? config[key] : defaultValue;
    }
    return config;
  }

  isHTML() {
    return isHTMLTag[this.tag];
  }

  isScopeSlot() {
    return this.parent?.tag === 'template' && this.parent.getSlotParam();
  }

  isTemplateNode() {
    return this.tag === 'template';
  }

  /***
   * 参数node是否是当前vucNode的子孙元素
   * @param node
   * @returns {boolean}
   */
  isOffspring(node) {
    if (this === node) return true;
    let t = node;

    while (true) {
      if (!t.parent) break;
      if (t.parent === this) return true;
      t = t.parent;
    }
    return false;
  }

  test(selector) {
    if (selector[0] === '.') {
      selector = selector.substr(1);
      let config = this.getConfig();
      if (config) {
        return config.type.includes(selector);
      }
    }
    return this.tag === selector || this.tag === formatComponentName(selector);
  }

  toTemplate(level = 0) {
    let indent =
        '\n' +
        Array(( level + 1 ) * 2)
            .fill(' ')
            .join('');

    if (this.isText()) {
      return indent + this.getText();
    }

    let attrs = this.getAttrsStr();
    if (attrs) {
      attrs = ' ' + attrs;
    }

    let prefix = `${ indent }<${ this.rawTag }${ attrs }>`;
    if (level === 0) {
      prefix = prefix.substring(1);
    }

    if (this.rawTag === 'img') {
      return prefix;
    }

    let suffix = `</${ this.rawTag }>`;
    let children = this.children;
    let childrenTemplate = '';

    if (children.length == 1 && children[0].isText()) {
      childrenTemplate = children[0].getText();
    } else if (children.length) {
      suffix = indent + suffix;
      childrenTemplate = this.children.map((child) => child.toTemplate(level + 1)).join('');
    }

    return prefix + childrenTemplate + suffix;
  }

  toString() {
    return this._astId;
  }

  get vucAst() {
    if (this.parent) {
      return this.parent.vucAst;
    }
    return this._vucAst;
  }
}

function getFindPredicate(selector) {
  return isString(selector) ? (child) => child.test(selector) : selector;
}

function createTemplateSlot(slot, scope, children) {
  let tag = 'template';
  let props = [parseAttr(`#${ slot }`, scope)];
  return new VucNode({
    tag,
    props,
    children,
  });
}

function defineNotEnumerProperty(obj, key, value) {
  Object.defineProperty(obj, key, {
    writable: true,
    enumerable: false,
    configurable: true,
    value,
  });
}

export default VucNode;
