import { ref } from 'vue';
import Configurator from '@/config';
import VucAst from './VucAst';
import Builder, { installModule, installDefaultModule } from './builder';
import File from './File';

const AST_PROCESSORS = [];

function registerAstProcess(processor) {
  AST_PROCESSORS.push(processor);
}

function createVucAst(content) {
  let file = new File('main.vue').setContent(content);

  let builder = new Builder();
  let build = builder.build(file);
  let entry = build.entry();
  let VueOption = entry.default;
  let result = build.result;

  let vucAst = ref(new VucAst(VueOption, file, result)).value;
  vucAst.createFunction = entry.__createFunction__;

  AST_PROCESSORS.forEach((AstProcessor) => {
    AstProcessor(vucAst);
  });

  return vucAst;
}

Configurator.registerConfig({ registerAstProcess, installModule, installDefaultModule });

export { createVucAst };
