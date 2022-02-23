import QuickStylePanel from '../../styles/QuickStylePanel';
import { registerComboMode } from '../comboMode';
import { parseComponentProps } from './util';

registerComboMode({
  mode: 'style',
  Component: QuickStylePanel,
  parseComponentProps(config, combo) {
    return parseComponentProps(config, combo, ['name', 'id']);
  },
});
