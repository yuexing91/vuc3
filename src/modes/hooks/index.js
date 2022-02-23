import HooksPanel from './HooksPanel.vue';
import { vucAstHooksProcess } from './ast.js';

import Configurator from '@/config';
Configurator.registerAstProcess(vucAstHooksProcess);

export default HooksPanel
