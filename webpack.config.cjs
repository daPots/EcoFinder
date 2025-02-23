const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    content: "./src/content/index.ts",
    background: "./src/background/index.ts",
    react: "./src/react/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    assetModuleFilename: "images/[hash][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" }, // ✅ Copy manifest.json
        { from: "index.html", to: "index.html" }, // ✅ Copy index.html
        { from: "logo.png", to: "logo.png" }, // ✅ Copy logo.png
      ],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};