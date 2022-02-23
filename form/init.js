import { Configurator } from '@';
import { componentConfigs, comboConfigs } from './configs';
import ColEditor from './components/attrEditor/ColEditor';
import ValidatorEditor from './components/attrEditor/ValidatorEditor';
import './mode/request';

export function init() {
  Configurator.registerValueEditor('col', {
    name: '栅格',
    dataType: 'object',
    Editor: ColEditor,
  });

  Configurator.registerValueEditor('validator', {
    name: '验证',
    dataType: 'object',
    Editor: ValidatorEditor,
  });

  componentConfigs.forEach(Configurator.setVucConfig);
  comboConfigs.forEach(Configurator.registerComboType);
}

