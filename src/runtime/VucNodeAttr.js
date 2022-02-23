import { camelize } from '@/helpers/lang';
import { PROP_TYPE_MAP, DIR_NAME_MAP } from './util';

export default class VucNodeAttr {
  constructor(props) {
    Object.assign(this, props);
    this.relAttrName = this.getAttrName();

    if (this.isVBind() && this.arg) {
      this.arg.content = camelize(this.arg.content);
    }

    if (this.isStaticBind()) {
      this.name = camelize(this.name);
    }

    this.attrName = this.getAttrName();
    this.attrValue = this.getAttrValue();
  }

  getArgContent() {
    return this.arg && this.arg.content;
  }

  getExpContent() {
    return this.exp && this.exp.content;
  }

  getBindName() {
    if (this.isStaticBind()) {
      return this.name;
    } else if (this.isVBind()) {
      return this.getArgContent();
    }
    return null;
  }

  isDirective() {
    return this.type === PROP_TYPE_MAP.DIRECTIVE;
  }

  isBind() {
    return this.isStaticBind() || this.isVBind();
  }

  isStaticBind() {
    return this.type === PROP_TYPE_MAP.ATTRIBUTE;
  }

  isVBind() {
    return this.isDirective() && this.name === 'bind';
  }

  onlyAttrName() {
    return this.attrValue === null;
  }

  isEvent() {
    return this.isDirective() && this.name === 'on';
  }

  isSolt() {
    return this.isDirective() && this.name === 'solt';
  }

  isMultipleDirective() {
    return this.isDirective() && ['model', 'on', 'bind', 'solt'].includes(this.name);
  }

  isSamlpeDirective() {
    return this.isDirective() && !['model', 'on', 'bind', 'slot', 'if', 'for', 'text', 'html', 'else', 'else-if', 'is'].includes(this.name);
  }

  eq(other) {
    if (this === other) return true;
    if (other == null) return false;

    return this.attrName === other.attrName && this.attrValue === other.attrValue;
  }

  valueEq(other) {
    if (this.type !== other.type) return false;

    let v1, v2;
    if (this.type === 6) {
      v1 = this.value;
      v2 = other.value;
    } else {
      v1 = this.exp;
      v2 = other.exp;
    }

    if (v1 == v2) return true;
    if (v1 == null || v2 == null) return false;
    return v1.content === v2.content;
  }

  getAttrName() {
    let { name, arg, modifiers } = this;
    switch (this.type) {
      case PROP_TYPE_MAP.ATTRIBUTE:
        return name;
      case PROP_TYPE_MAP.DIRECTIVE:
        let vName = `v-${ name }`;
        let dir = DIR_NAME_MAP[name];
        if (arg) {
          let argStr = arg.isStatic ? arg.content : `[${ arg.content }]`;
          vName = dir ? dir + argStr : vName + ':' + argStr;
        }

        if (modifiers.length) {
          vName += '.' + modifiers.join('.');
        }
        return vName;
    }
  }

  getAttrValue() {
    switch (this.type) {
      case PROP_TYPE_MAP.ATTRIBUTE:
        return this.value ? this.value.content : null;
      case PROP_TYPE_MAP.DIRECTIVE:
        return this.exp ? this.exp.content : null;
    }
  }

  toString() {
    if (this.attrValue === undefined) return;
    if (this.attrValue === null) return this.relAttrName;
    return `${ this.relAttrName }="${ this.attrValue }"`;
  }
}
