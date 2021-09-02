const path    = require('path');

module.exports = [
    {
        mode  : 'development',
        entry : './src/deriv_api/DerivAPIBasic.js',
        devtool: 'inline-source-map',
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
];
