const path = require("path");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: {
    viewer: "./client/index.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public"),
  },
  resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] },
  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
    ],
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
};
