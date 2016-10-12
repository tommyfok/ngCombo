var webpack = require('webpack');

module.exports = {
    entry: './src/ngCombo.js',
    output: {
        filename: 'ngCombo.js',
        path: './build/'
    },
    plugins: [new webpack.optimize.UglifyJsPlugin({mangle:false})],
    // devtool: '#source-map',
    module: {
        loaders: [
            { 
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015']
                }
            },
            {test: /\.html$/, loader: 'html'},
            {test: /\.less$/, loader: 'style!css!autoprefixer!less'},
            {test: /\.(png|gif|jpg)$/, loader: 'url'}
        ]
    }
};
