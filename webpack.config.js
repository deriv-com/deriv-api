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
            new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
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
