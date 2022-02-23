import { getVucConfig, setVucConfig } from './vucConfig';

const CONFIGS = Object.create(null);

function setConfig(key, value) {
  CONFIGS[key] = value;
}

function getConfig(key, defaultValue) {
  return CONFIGS.hasOwnProperty(key) ? CONFIGS[key] : defaultValue;
}

const Configurator = {
  setVucConfig,
  getVucConfig,
  setConfig,
  getConfig,
  registerConfig(key, configFn) {
    if (typeof key == 'string') {
      Configurator[key] = configFn;
    } else {
      for (let k in key) {
        Configurator[k] = key[k];
      }
    }
  },
};



export { setVucConfig, getVucConfig, setConfig, getConfig };

export default Configurator;
