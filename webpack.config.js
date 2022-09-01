
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, './src/VirtualEnvironment.js'),
    output: {
        path: path.resolve(__dirname, './server/client/build'),
        filename: 'bundle.min.js',
        libraryTarget: 'umd',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './examples'),
        },
        hot: true,
        host: '0.0.0.0',
        client: {
            overlay: false,
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    experiments: {
        asyncWebAssembly: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BLOCKFROST_API_KEY': JSON.stringify(process.env.BLOCKFROST_API_KEY)
        })
    ],
    resolve: {
        fallback: { 
            "buffer": require.resolve("buffer/")
        }
    }
};
