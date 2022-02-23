import { astToCode, getPropertyId } from '@/helpers/esprimaHelper';
import { createVucPorxyApp } from './proxy/VucProxy';
import VucNode from './VucNode';
import { callHook } from '@/runtime/proxy/util';

class VucAst {
  constructor(VueOption, file, loaderResult) {
    this.file = file;
    this.loaderResult = loaderResult;
    this.VueOption = VueOption;
    this.vucInstance = null;

    let rootNode = VueOption.ast.children.find(child => child.type !== 3);
    if (rootNode) {
      this.setRootNode(new VucNode(rootNode, null));
    }

    this.exportDefault = this.loaderResult.ScriptProgram.body.find((expr) => expr.type === 'ExportDefaultDeclaration');
  }

  setRootNode(rootNode) {
    if (rootNode) {
      Object.defineProperty(rootNode, '_vucAst', {
        writable: true,
        enumerable: false,
        configurable: true,
        value: this,
      });
    }
    this.rootNode = rootNode;
  }

  getExportProperty(name, defaultProperty) {
    let properties = this.exportDefault.declaration.properties;
    let property = properties.find((p) => getPropertyId(p) === name);

    if (!property && defaultProperty) {
      property = defaultProperty;
      properties.push(property);
    }

    return property;
  }

  getContent() {
    let code = [
      '<template>',
      this.rootNode ? this.rootNode.toTemplate() : '',
      '</template>',
      '<script>',
      astToCode(this.loaderResult.ScriptProgram),
      '</script>',
    ].join('\n');

    return code;
  }

  getTemplate() {
    return ( this.rootNode ? this.rootNode.toTemplate() : '' );
  }

  querySelector(iterator) {
    return this.rootNode?.querySelector(iterator, true);
  }

  querySelectorAll(iterator) {
    return this.rootNode?.querySelectorAll(iterator, true);
  }

  eachAllNode(iterator) {
    this.rootNode?.eachAllNode(iterator);
  }

  getVucNodeByAstId(astId) {
    let node = null;
    this.rootNode.dfs((curNode) => {
      if (curNode._astId == astId) {
        node = curNode;
        return -1;
      }
    }, true);
    return node;
  }

  createVucProxyApp() {
    const vucAst = this;
    this.vucPorxyApp = createVucPorxyApp(this, {
      created() {
        vucAst.vucInstance = this;
      },
    });
  }

  mount(el) {
    this.vucPorxyAppInstance = this.vucPorxyApp.mount(el);
  }

  unmount() {
    if (this.vucPorxyAppInstance) {
      this.vucPorxyApp.unmount();
      this.vucPorxyAppInstance = null;
    }
  }

  forceUpdate() {
    this.vucInstance.$forceUpdate();
  }

  createRenderContext() {
    return this.renderContext = {
      vucAst: this,
    };
  }

}

export default VucAst;
