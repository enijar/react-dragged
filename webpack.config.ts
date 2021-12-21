import * as path from "path";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const DEV_MODE = process.env.NODE_ENV === "development";
const SRC_DIR = path.resolve(__dirname, "examples");
const BUILD_DIR = path.resolve(__dirname, "build");

const config = {
  mode: DEV_MODE ? "development" : "production",
  target: DEV_MODE ? "web" : "browserslist",
  stats: "minimal",
  devtool: DEV_MODE ? "eval-cheap-module-source-map" : "source-map",
  entry: path.join(SRC_DIR, "index.tsx"),
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript", "@babel/preset-react"],
              plugins: DEV_MODE ? ["react-refresh/babel"] : [],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: DEV_MODE,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: "body",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    path: BUILD_DIR,
    clean: true,
    publicPath: "",
  },
};

export default () => {
  if (!DEV_MODE) {
    config.plugins.push(new HtmlInlineScriptPlugin([/main.+[.]js$/]));
  }
  return config;
};
