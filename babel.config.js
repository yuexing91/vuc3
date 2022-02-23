module.exports = {
  //  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: ['@babel/plugin-proposal-export-default-from'],
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: false,
      },
    ],
  ],
};
