import Configurator from '@/config';
import ComboType from './ComboType';
import { registerComboMode } from './comboMode';
import './comboModes/propMode';
import './comboModes/eventMode';
import './comboModes/styleMode';

const COMBOTYPE_MAPS = Object.create(null);

function registerComboType(options) {
  COMBOTYPE_MAPS[options.id] = new ComboType(options);
}

function createCombo(vNode) {
  for(let id in COMBOTYPE_MAPS) {
    let comboType = COMBOTYPE_MAPS[id];
    let combo = comboType.createCombo(vNode);
    if (combo) {
      return combo;
    }
  }
}

Configurator.registerConfig({ registerComboType, registerComboMode });

export { createCombo };
