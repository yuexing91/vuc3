import QuickEventPanel from '../../events/QuickEventPanel';
import { registerComboMode } from '../comboMode';
import { parseComponentProps } from './util';

registerComboMode({
  mode: 'event',
  Component: QuickEventPanel,
  parseComponentProps(config, combo) {
    return parseComponentProps(config, combo, ['name', 'id']);
  },
});
