import Configurator from '@/config';
import DataPanel from './DataPanel';
import { vucAstDataProcess } from './ast.js';
import { setDataFormExtra } from './dataExtra.js';

Configurator.registerAstProcess(vucAstDataProcess);
Configurator.registerConfig('setDataFormExtra', setDataFormExtra);


export default DataPanel;
