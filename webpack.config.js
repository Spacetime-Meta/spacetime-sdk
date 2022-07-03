
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, './src/VirtualEnvironment.js'),
    module: {
        rules: [
            {
                test: /\.(png|glb)$/,
                use: "raw-loader",
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.min.js',
        library: '',
        libraryExport: '',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
};
