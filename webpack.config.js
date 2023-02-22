const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const PATHS = {  src: path.join(__dirname, 'src'),  output: path.join(__dirname, 'dist')};
const entries = { hub: path.join(PATHS.src, 'hub.tsx')};

console.log(entries)

module.exports = {
  entry: entries,
  devtool: "inline-source-map",
  output: {
    filename: "[name].js",
    publicPath: "/dist/",
  },
  devServer: {
    https: true,
    port: 3000,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "**/*.html", context: "src" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
};
