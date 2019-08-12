const path    = require('path');
const webpack = require('webpack');

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
    },
];
