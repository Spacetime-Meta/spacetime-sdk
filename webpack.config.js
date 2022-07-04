
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, './src/VirtualEnvironment.js'),
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.min.js',
        libraryTarget: 'umd',
    },
};
