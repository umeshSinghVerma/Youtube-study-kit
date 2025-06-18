module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.entry = {
        main: './src/index.js',
        updateContent: './src/updateContent.js'
      };
      webpackConfig.output.filename = (pathData) => {
        return pathData.chunk.name === 'main'
          ? 'static/js/[name].[contenthash:8].js'
          : '[name].js';
      };
      return webpackConfig;
    }
  }
};
