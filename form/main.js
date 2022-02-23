import { createApp, h, resolveComponent, withDirectives, resolveDirective } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as AntIcons from '@ant-design/icons-vue';
import { Configurator } from '@';

import FormDesigner from './components/FormDesigner';
import EditableTable from './form/EditableTable';

import { init } from './init';

import zhCN from 'ant-design-vue/es/locale/zh_CN';

import { formDemo } from './formDemo';
import { kebabCase } from '@/helpers/lang';

import DemoInput from './DemoInput';

function initApp(App, options) {
  let app = createApp(App, options);
  app.use(Antd);
  for(let key in AntIcons) {
    app.component(key, AntIcons[key]);
  }
  return app;
}

init();

Configurator.setVucProxyCreateApp((VucProxy) => {
  let Wraper = {
    render() {
      return h(
          resolveComponent('a-config-provider'), {
            locale: zhCN,
          },
          {
            default: () => h(VucProxy),
          },
      );
    },
  };

  let app = initApp(Wraper);
  app.component(EditableTable.name, EditableTable);
  app.component(EditableTable.Column.name, EditableTable.Column);
  app.component('DemoInput', DemoInput);
  return app;
});

Configurator.setVucConfig({
  id: 'DemoInput',
  props: {
    width: {
      label: '宽',
      editors: [
        'number',
        'string',
      ],
    },
  },
});

formDemo();

createApp(FormDesigner).mount('#app');
//
////import CodeVisualEditor from './CodeVisualEditor/CodeVisualEditor';
////
////initApp(CodeVisualEditor, {
////  vueContent,
////  formComponents: ExplorerComponents,
////}).mount('#app');
