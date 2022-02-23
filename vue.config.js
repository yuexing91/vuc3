const nodeExternals = require('webpack-node-externals');

module.exports = {
  lintOnSave: false,
  configureWebpack(config) {
    if (process.env.NODE_ENV !== 'production') {
      config.entry = ['./form/main.js'];
    } else {
      config.externals = [nodeExternals()];
    }
  },
};
