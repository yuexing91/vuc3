import WatchPanel from './WatchPanel';
import WatchFormModal from './WatchFormModal';
import { vucAstWatchProcess } from './ast.js';

import Configurator from '@/config';

Configurator.registerAstProcess(vucAstWatchProcess);

let extra = {
  onSave(data, oldData, vucAst) {
    if (data.watchData) {
      if (oldData.path && data.path !== oldData.path) {
        vucAst.delWatch(oldData.path);
      } else if (oldData.id && data.id !== oldData.id) {
        vucAst.delWatch(oldData.id);
      }
      data.watchData.id = data.path || data.id;
      vucAst.saveWatch(data.watchData);
    }
  },
  formItems: [
    {
      label: '监听',
      component: WatchFormModal,
    },
  ],
};

Configurator.setDataFormExtra(extra);
Configurator.setComputedFormExtra(extra);

export default WatchPanel;
