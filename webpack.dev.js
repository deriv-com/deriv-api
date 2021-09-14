const path    = require('path');
const webpack = require('webpack');

module.exports = [
    {
        mode  : 'development',
        entry : './src/deriv_api/DerivAPIBasic.js',
        devtool: 'inline-source-map',
        output: {
            filename     : 'DerivAPIBasic.js',
            globalObject : "typeof self !== 'undefined' ? self : this", // Because webpack sucks
            library      : {
                name: 'DerivAPIBasic',
                type: '',
            },
            libraryExport: 'default',
            path         : path.resolve(__dirname, 'dist'),
        },
        module: {
            rules: [
                {
                    test   : /\.js$/,
                    exclude: /node_modules/,
                    use    : {
                        loader: 'babel-loader',
                    },
                },
            ],
        },
    },
    {
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ],
        mode  : 'development',
        entry : './src/DerivAPI.js',
        devtool: 'inline-source-map',
        output: {
            filename     : 'DerivAPI.js',
            globalObject : "typeof self !== 'undefined' ? self : this", // Because webpack sucks
            library      : 'DerivAPI',
            libraryExport: 'default',
            libraryTarget: 'umd',
            path         : path.resolve(__dirname, 'dist'),
        },
        module: {
            rules: [
                {
                    test   : /\.js$/,
                    exclude: /node_modules/,
                    use    : {
                        loader: 'babel-loader',
                    },
                },
            ],
        },
    },
];
