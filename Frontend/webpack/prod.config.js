const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const baseConfig = require('./base.config');
const cssLoader = require('./cssLoader');
const postcssLoader = require('./postcssLoader');
const { PUBLIC_PATH, SCRIPTS_DIR_NAME, STYLES_DIR_NAME } = require('./constants');
const externalStylesList = require('./externalStylesList')

const prod = merge(baseConfig, {
    mode: 'production',
    output: {
        filename: `${SCRIPTS_DIR_NAME}/[name].[chunkhash].js`,
        chunkFilename: `${SCRIPTS_DIR_NAME}/[name].[chunkhash].js`,
    },
});

/* MiniCssExtractPlugin.loader should be used only on production builds
without style-loader in the loaders chain, especially if you want to have
HMR in development. */
prod.module.rules.push({
    test: /\.css$/,
    exclude: externalStylesList,
    use: [
        MiniCssExtractPlugin.loader,
        cssLoader(),
        postcssLoader,
    ],
});

prod.module.rules.push({
    test: externalStylesList,
    use: [
        MiniCssExtractPlugin.loader,
        cssLoader(false),
        postcssLoader,
    ],
});

prod.optimization.minimizer = [new TerserPlugin({
    parallel: true,
    extractComments: true,
})];

const cleanWebpackPlugin = new CleanWebpackPlugin(
    [SCRIPTS_DIR_NAME, STYLES_DIR_NAME],
    { root: PUBLIC_PATH },
);

const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: `./${STYLES_DIR_NAME}/[name].bundle.css`,
    chunkFilename: `./${STYLES_DIR_NAME}/[name].bundle.css`,
});

prod.plugins.unshift(cleanWebpackPlugin, miniCssExtractPlugin);

module.exports = prod;
