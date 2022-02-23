//import { parseComponent } from '../../vue-template-compiler/build.js';
import { /*compileToFunction,*/ parseAst } from '../../vue-template-compiler/compile.js';
import JsLoader from './jsLoader';

export default function (builder, content, file) {

  let sfcAst = parseAst(content);
  let ast = sfcAst.children.find(child => child.tag == 'template');

  let scriptTag = sfcAst.children.find(child => child.tag == 'script');
  let jsResult = JsLoader(builder, scriptTag.children[0].content, file);

//  let component = parseComponent(content);
//  let templateTag = component.template;
//  let scriptTag = component.script;
//  let jsResult = JsLoader(builder, scriptTag.content, file);
////  let render = compileToFunction(templateTag.content);
//  let ast = parseAst(templateTag.content);

  let path = file.getPath();

  let outPut = `
      var ex = __vuc_require__('${ path }?js');
      var __vue_script__ = ex.default;
      var __vue_template__ = __vuc_require__('${ path }?template').default;
      var options = typeof __vue_script__ === 'function' ? __vue_script__.options : __vue_script__;
      if (__vue_template__) {
        options.render = __vue_template__.render;
        options.ast = __vue_template__.ast;
        options._compiled = true;
        options._filePath = '${ path }';
      }
      Object.assign(__vuc_exports__,ex);`;

  return {
    modules: [
      { name: path, module: outPut },
      { name: path + '?js', module: jsResult.modules },
      {
        name: path + '?template',
        module: function (module, __vuc_exports__, __vuc_require__) {
          return __vuc_exports__.default = {
            ast,
//            render,
          };
        },
      },
    ],
    ScriptProgram: jsResult.Program,
    ScriptContent: scriptTag.content,
  };
}
