import PropPanel from '@/modes/props/PropPanel';
import { registerComboMode } from '@/modes/combo/comboMode';
import { parseComponentProps } from './util';

registerComboMode({
  mode: 'prop',
  Component: PropPanel,
  parseComponentProps(config, combo) {
    return parseComponentProps(config, combo, ['name', 'label']);
  },
});
