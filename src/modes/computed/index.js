import ComputedPanel from './ComputedPanel';
import { vucAstComputedProcess } from './ast.js';

import Configurator from '@/config';
import { setComputedFormExtra } from './dataExtra';

Configurator.registerAstProcess(vucAstComputedProcess);

Configurator.registerConfig('setComputedFormExtra', setComputedFormExtra);

export default ComputedPanel;
