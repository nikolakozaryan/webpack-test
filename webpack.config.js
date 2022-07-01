const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [new CssMinimizerPlugin(), new TerserWebpackPlugin()];
  }
  return config;
};

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const cssLoaders = (ext) => {
  const loaders = [MiniCssExtractPlugin.loader, "css-loader"];

  if (ext) {
    loaders.push(`${ext}-loader`);
  }

  return loaders;
};

const babelOptions = (type) => {
  const configuration = {
    presets: ["@babel/preset-env"],
  };
  if (type === "ts") {
    configuration.presets.push("@babel/preset-typescript");
  }
  return configuration;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: "./index.js",
    analytics: "./analytics.ts",
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".json", ".png"],
    alias: {
      "@styles": path.resolve(__dirname, "src", "styles"),
      "@assets": path.resolve(__dirname, "src", "assets"),
    },
  },
  plugins: [
    //добавление в бандл index.html
    new HtmlWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    //очистка dist от лишнего
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "image.ico"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    //extract css to file
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
  ],
  devServer: {
    port: 4200,
    hot: isDev,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders("less"),
      },
      {
        test: /\.s[a|c]ss$/,
        use: cssLoaders("sass"),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource",
      },
      {
        test: /\.(ttf|woff|woff-2|eot)$/,
        type: "asset/resource",
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions(),
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("ts"),
        },
      },
    ],
  },
  optimization: optimization(),
};
