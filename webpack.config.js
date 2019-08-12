const path    = require('path');
const webpack = require('webpack');

module.exports = [
    {
        mode  : 'production',
        entry : './src/deriv_api/DerivAPIBasic.js',
        output: {
            library      : 'DerivAPIBasic',
            libraryTarget: 'umd',
            filename     : 'DerivAPIBasic.js',
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
            library      : 'DerivAPI',
            libraryTarget: 'umd',
            filename     : 'DerivAPI.js',
            path         : path.resolve(__dirname, 'dist'),
        },
    },
];
