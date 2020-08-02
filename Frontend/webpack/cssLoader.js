module.exports = (withHash = true) => ({
    loader: 'css-loader',
    options: {
        importLoaders: 1,
        modules: true,
        minimize: true,
        sourceMap: true,
        localIdentName: withHash ? '[local]_[hash:base64:4]' : '[local]',
    },
});
