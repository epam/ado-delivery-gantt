const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const PATHS = {  src: path.join(__dirname, 'src'),  output: path.join(__dirname, 'dist')};
const dev_suffix = ":dev";
const dev_entry = [path.join(PATHS.src, 'interceptors.ts')];

const assembleEntries = (entries) => Object.keys(entries)
  .map(key => ({ key, value: entries[key] }))
  .map(({ key, value }, index) => ({ [key]: !index ? [...dev_entry, ...(Array.isArray(value) && value || [value])] : value }))
  .reduce((acc, next) => ({ ...acc, ...next }), {});

const devEntriesResolver = (entries) => (process.env.npm_lifecycle_event.endsWith(dev_suffix)) ? assembleEntries(entries) : entries;

module.exports = {
  entry: devEntriesResolver({ hub: [path.join(PATHS.src, 'hub.tsx')] }),
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
