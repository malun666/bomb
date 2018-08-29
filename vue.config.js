module.exports = {
  chainWebpack: config => {
    config.module
      .rule("mp3")
      .test(/\.mp3$/)
      .include()
      .add("src/assets/")
      .end()
      .use("file-loader")
      .loader("vue-loader");
  }
};
