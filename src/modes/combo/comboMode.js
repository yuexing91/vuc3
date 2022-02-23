const COMBOMODE_MAPS = Object.create(null);

function registerComboMode(comboMode) {
  COMBOMODE_MAPS[comboMode.mode] = comboMode;
}

function getComboMode(mode) {
  return COMBOMODE_MAPS[mode];
}

export {
  registerComboMode,
  getComboMode,
};
