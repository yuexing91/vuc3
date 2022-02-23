import { formatComponentName, castArray } from '@/helpers/lang';

const vucConfigs = {};

export function getVucConfig(id) {
  if (!id) return;
  return vucConfigs[id] || vucConfigs[formatComponentName(id)];
}

export function setVucConfig(config) {
  castArray(config.id).forEach((id) => {
    id = formatComponentName(id);
    vucConfigs[id] = config;
  });
}
