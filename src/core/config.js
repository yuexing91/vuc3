import Configurator from '@/config';
import { isObject } from '@/helpers/lang';

const EDITOR_CONFIGS = {
  proxyHooks: {},
  designerHooks: {},
  editorHooks: {},
  createProxyApp: null,
};

function mergeOptions(obj, key, value) {
  obj[key] = obj[key] || [];
  obj[key].push(value);
}

function forEachObj(obj, it) {
  for(let key in obj) {
    it(obj[key], key);
  }
}

function setHooks(hooks, key, value) {
  function putHooks(k, v) {
    mergeOptions(hooks, k, v);
  }

  if (isObject(key)) {
    forEachObj(key, (v, k) => putHooks(k, v));
  } else {
    putHooks(key, value);
  }
}

function setVucProxyHooks(key, value) {
  setHooks(EDITOR_CONFIGS.proxyHooks, key, value);
}

function getVucProxyHooks() {
  return EDITOR_CONFIGS.proxyHooks;
}

function setVucEditorHooks(key, value) {
  setHooks(EDITOR_CONFIGS.editorHooks, key, value);
}

function getVucEditorHook(name) {
  return EDITOR_CONFIGS.editorHooks[name] || [];
}

function setVucProxyCreateApp(createApp) {
  EDITOR_CONFIGS.createProxyApp = createApp;
}

function getVucProxyCreateApp() {
  return EDITOR_CONFIGS.createProxyApp;
}

Configurator.registerConfig('setVucEditorHooks', setVucEditorHooks);
Configurator.registerConfig('setVucProxyHooks', setVucProxyHooks);
Configurator.registerConfig('setVucProxyCreateApp', setVucProxyCreateApp);

export { getVucProxyHooks, getVucEditorHook, getVucProxyCreateApp };
export { setVucEditorHooks, setVucProxyCreateApp, setVucProxyHooks };
