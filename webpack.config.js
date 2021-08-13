const path          = require('path');
const webpack       = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = [
    {
        mode  : 'production',
        entry : './src/deriv_api/DerivAPIBasic.js',
        output: {
            filename     : 'DerivAPIBasic.js',
            globalObject : "typeof self !== 'undefined' ? self : this", // Because webpack sucks
            library      : 'DerivAPIBasic',
            libraryExport: 'default',
            libraryTarget: 'umd',
            path         : path.resolve(__dirname, 'dist'),
        },
        externals: [nodeExternals()], // fix https://github.com/websockets/ws/issues/1126
        module   : {
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
        mode  : 'production',
        entry : './src/DerivAPI.js',
        output: {
            filename     : 'DerivAPI.js',
            globalObject : "typeof self !== 'undefined' ? self : this", // Because webpack sucks
            library      : 'DerivAPI',
            libraryExport: 'default',
            libraryTarget: 'umd',
            path         : path.resolve(__dirname, 'dist'),
        },
        externals: [nodeExternals()],
        module   : {
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
