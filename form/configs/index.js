const vuc = require.context(
    // 其组件目录的相对路径
    './components',
    // 是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    /[A-Z]\w+\.(vue|js)$/,
);

const combo = require.context(
    // 其组件目录的相对路径
    './combo',
    // 是否查询其子目录
    false,
    // 匹配基础组件文件名的正则表达式
    /[A-Z]\w+\.(vue|js)$/,
);

function getConfigs(configs) {
  return configs.keys().map(fileName => {
    return configs(fileName).default;
  });
}

const componentConfigs = getConfigs(vuc);
const comboConfigs = getConfigs(combo);

export {
  componentConfigs,
  comboConfigs,
};
