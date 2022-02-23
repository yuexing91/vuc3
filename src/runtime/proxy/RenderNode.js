import { resolveDirective, vShow } from 'vue';
import { callHook } from './util';

class RenderNode {
  constructor(node, context) {
    this.context = context;
    this.node = node;
    this.attrMap = this.getAttrMap();
    this.children = node.children?.map((n) => new RenderNode(n, context));
  }

  getAttrMap() {
    let { node, context } = this;

    let proxyDirs = [];
    let attrMap = {};
    node.props?.forEach((attr) => {
      if (attr.isSamlpeDirective()) {
        let arg = 'null';
        let value = 'undefined';
        let modifiers = ( attr?.modifiers.join('.') ) || '';
        if (attr.arg) {
          arg = attr.arg.isStatic ? `'${ attr.arg.content }'` : attr.arg.content;
        }
        if (attr.exp) {
          value = attr.exp.content;
        }
        context.dirsMap[attr.name] = attr.name === 'show' ? vShow : resolveDirective(attr.name);
        proxyDirs.push(` { name:'${ attr.name }',arg:${ arg },modifiers:'${ modifiers }',value: ${ value } } `);
      } else {
        attrMap[attr.attrName] = attr.attrValue;
      }
    });

    if (node.isText()) {
    } else if (node.isHTML()) {
      attrMap['data-ast-id'] = node._astId;
    } else if (node.tag !== 'template') {
      attrMap['v-ast-id'] = `'${node._astId}'`;
    }
    attrMap['v-ast-proxy'] = `[${ proxyDirs.join(',') }]`;

    if (node.tag !== 'template' && !node.isHTML() && !node.getBind('key')) {
      attrMap.key = node._key;
    }

    return attrMap;
  }

  getAttrStr() {
    let arr = [];
    for(let k in this.attrMap) {
      let v = this.attrMap[k];
      if (v === undefined) {
      } else if (v === null) {
        arr.push(k);
      } else {
        arr.push(`${ k }="${ v.replace ? v.replace(/\"/g, `'`) : v }"`);
      }
    }
    return arr.join(' ');
  }

  toTemplate() {
    let { node, context } = this;
    let vucAst = context.vucAst;
    let error = vucAst.errorIdMaps && vucAst.errorIdMaps[node._astId];
    if (error) {
      return `<div data-ast-id="${ node._astId }">渲染出错:${ error }</div>`;
    }

    if (node.isText()) {
      return node.getText();
      //    let parentVucProxyOption = node.parent.getConfig('vucProxyOption');
      //    if (parentVucProxyOption && parentVucProxyOption.textProxy === false) {
      //      return node.getText();
      //    }
      //
      //    defaultAttrsMap.class = 'vuc-proxy-text';
      //    defaultAttrsMap['data-ast-id'] = node._astId;
      //
      //    let attrs = getAttrStr(Object.assign({}, extraAttrsMap, defaultAttrsMap));
      //    return `<span ${attrs}>${node.getText()}</span>`;
    }

    try {
      callHook('onRender', this, context);

      let vucProxyOption = node.getConfig('vucProxyOption');
      if (vucProxyOption?.onRender) {
        vucProxyOption.onRender(this, context);
      }

      let childrenTemplate = this.children.map((n) => n.toTemplate(context)).join('\n');

      let attrs = this.getAttrStr();
      if (node.tag === 'img') {
        return `<${ node.tag } ${ attrs }>`;
      }

      return `<${ node.tag } ${ attrs }>${ childrenTemplate }</${ node.tag }>`;
    } catch (e) {
      console.error(e);
      return '<span>创建模板出错</span>';
    }
  }
}

export default RenderNode;
