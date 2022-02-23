import MethodPanel from './MethodPanel.vue';
import { vucAstMethodProcess } from './ast.js';
import Configurator from '@/config';

Configurator.registerAstProcess(vucAstMethodProcess);

export default MethodPanel;
