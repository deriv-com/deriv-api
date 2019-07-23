const path = require('path');
const webpack = require('webpack');


module.exports = [{
    mode: 'production',
    entry: './src/DerivAPI/DerivAPIBasic.js',
    output: {
        library: 'DerivAPIBasic',
        libraryTarget: 'commonjs2',
        filename: 'DerivAPIBasic.js',
        path: path.resolve(__dirname, 'dist'),
    },
}, {
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	],
    mode: 'production',
    entry: './src/DerivAPI.js',
    output: {
        library: 'DerivAPI',
        libraryTarget: 'commonjs2',
        filename: 'DerivAPI.js',
        path: path.resolve(__dirname, 'dist'),
    },
}];
