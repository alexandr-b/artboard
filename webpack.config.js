const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: `./src/index.js`,
  devServer: {
    contentBase: path.join(__dirname, `dist`),
    port: 5000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/env', { targets: { browsers: ['chrome 75'] } }],
            ]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=image/svg+xml' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `./src/index.ejs`,
      inject: `body`,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  ],
  output: {
    filename: `./main.js`,
    path: path.resolve(__dirname, `dist`),
  },
};