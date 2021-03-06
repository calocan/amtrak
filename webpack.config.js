/**
 * Created by Andy Likuski on 2016.05.24
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        main:[
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            './src/index.js'
        ],
        testEmbed: [
            './src/startup_b56fb52.js'
        ]
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: '[name].bundle.js'
    },
    devServer: {
        contentBase: './dist',
        headers: { },
        hot: true,
        proxy: {
            '/warehouse**': {
                target: 'https://3dwarehouse.sketchup.com',
                secure: false,
                changeOrigin: true
            },
            /*
            "/embed.html**": {
                "target": {
                    "host": "3dwarehouse.sketchup.com",
                    "protocol": 'https:',
                    "port": 443 
                },
                changeOrigin: true,
            },
            */
            '/js**': {
                target: 'https://3dwarehouse.sketchup.com',
                secure: false,
                changeOrigin: true
            },
            '/img**': {
                target: 'https://3dwarehouse.sketchup.com',
                secure: false,
                changeOrigin: true
            },
            '/third-party**': {
                target: 'https://3dwarehouse.sketchup.com',
                secure: false,
                changeOrigin: true
            },
            '/css**': {
                target: 'https://3dwarehouse.sketchup.com',
                secure: false,
                changeOrigin: true
            },
            /*
            '/compiled**': {
                target: 'https://3dwarehouse.sketchup.com',
                secure: false,
                changeOrigin: true
            },
            */
            '/fonts**': {
                target: 'https://3dwarehouse.sketchup.com',
                secure: false,
                changeOrigin: true
            }
        },

        inline: false,
        historyApiFallback: false,
        stats: {
            colors: true,
        },
        watchOptions: {
            aggregateTimeout: 250,
            poll: 50
        },
        watch: true,
        host: '0.0.0.0',
        noCredentials: true,
        lazy: false, // No watching, compiles on request (cannot be combined with --hot).
        quiet: false, // Display nothing to the console
        noInfo: false // Display no info to console (only warnings and errors)
    },
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            // {output}/file.txt
            { from: 'src/compiled_*.js' },
            { from: 'src/skjviewer.js', to: 'src/skjviewer.js' },
            { from: 'src/three.min.js', to: 'src/three.min.js' }
        ])
    ]
};