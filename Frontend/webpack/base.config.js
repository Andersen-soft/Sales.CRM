require('dotenv').config();

const path = require('path');
const { ROOT_PATH, SRC_PATH, PUBLIC_PATH } = require('./constants');
const webpack = require('webpack');
// plugins
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const alias = require('./alias.js');
// environment variables
const { NODE_ENV = 'production', API_URL, USE_1C } = process.env;

module.exports = {
    mode: false,
    devtool: false, // use SourceMapDevToolPlugin instead
    entry: {
        client: path.join(SRC_PATH, 'index.jsx'),
    },
    output: {
        path: path.join(PUBLIC_PATH),
        publicPath: '/',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: true,
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                },
            },
        },
        usedExports: true,
        sideEffects: true,
    },
    resolve: {
        alias,
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules([\\/]*jss*|!?[\\/]css-vendor*)/,
                loader: 'babel-loader',
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "babel-loader"
                    },
                    {
                        loader: "react-svg-loader",
                        options: {
                            jsx: true // true outputs JSX tags
                        }
                    }
                ]
            }
        ],
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new HtmlWebpackPlugin({
            inject: true,
            template: './webpack/template.html',
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV,
            API_URL,
            USE_1C: 'false',
        }),
    ],
};
