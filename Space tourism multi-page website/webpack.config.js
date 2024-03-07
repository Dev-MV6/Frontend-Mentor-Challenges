const path = require("path")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const isDevelopment = process.env.NODE_ENV !== "production"

module.exports = {
  devtool: "source-map",
  mode: isDevelopment ? "development" : "production",
  entry: "./src/main.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", ["@babel/preset-react", { runtime: "automatic" }]],
            plugins: isDevelopment ? ["react-refresh/babel"] : [],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // Creates `style` nodes from JS strings
          { loader: "css-loader", options: { url: false } }, // Translates CSS into CommonJS
          "sass-loader", // Compiles SASS to CSS
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "./index.html",
      template: "./src/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "" }],
    }),
  ].filter(Boolean),
  devServer: {
    host: "0.0.0.0",
    static: path.join(__dirname, "dist"),
    compress: false,
    hot: true,
    port: 9000,
    historyApiFallback: true, // Redirect all requests to index.html (not required when using HashRouter)
    // headers: {
      // "Cache-Control": "public, max-age=31536000",
    // },
  },
}
