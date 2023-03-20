const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PATHS = { src: path.join(__dirname, 'src'), output: path.join(__dirname, 'dist') };
const dev_mode = "development";
const dev_entry = [path.join(PATHS.src, 'interceptors.ts')];
const assembleEntries = (entries) => Object.keys(entries)
  .map(key => ({ key, value: entries[key] }))
  .map(({ key, value }, index) => ({ [key]: !index ? [...dev_entry, ...(Array.isArray(value) && value || [value])] : value }))
  .reduce((acc, next) => ({ ...acc, ...next }), {});
const devEntriesResolver = (entries) => (process.env.NODE_ENV === dev_mode) ? assembleEntries(entries) : entries;

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
    new MiniCssExtractPlugin({
      filename: "[name].css",
    })
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
        use: [MiniCssExtractPlugin.loader, {
          loader: "css-loader",
          options: {
            import: true,
          },
        }],
      },
      {
        test: /\.s[ca]ss$/i,
        use: [MiniCssExtractPlugin.loader, {
          loader: "css-loader",
          options: {
            import: false,
          },
        }, "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|woff|woff2|eot|ttf|svg)$/,
        type: "asset/inline", generator: {
          dataUrl: content => `data:application/font-woff;base64,${content.toString("base64")}`
        }
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
};
