'use strict';

var path = require('path'),
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		'bundle': './app/app_ghostrunner/main.js'
	},
	output: {
		path: './app/app_ghostrunner/build/',
		filename: '[name].js'
	},
	devtool: 'cheap-module-eval-source-map',
	watch: true,
	keepalive: true,
	module: {
		loaders: [
			{
				test: /\.(jpe?g|png|gif)$/i,
				loaders: [
					'file?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			},
			{ 
				test: /([a-z0-9]+)\/([a-z0-9]+\.png)$/, 
				loader: "url-loader?name=$1/$2" 
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
				exclude: /node_modules/
			},
			{
				test: /vendor\/.+\.(jsx|js)$/,
				loader: 'imports?jQuery=jquery,$=jquery,this=>window',
				exclude: /node_modules/
			},
			{
				test   : /vendor\/.+\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				loader : 'file-loader',
				exclude: /node_modules/
			},
			{
				test: /\.hbs$/,
				loader: "handlebars-loader"
			},
			{
                test: /bootstrap\/js\//,
                loader: 'imports?jQuery=jquery'
            },
			{
			    test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			    loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
			    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			    loader: "file-loader"
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'Cookie': 'js.cookie',
			'_': 'underscore',
			'Backbone': 'backbone',
			'Marionette': 'backbone.marionette',
			'Mn': 'backbone.marionette'
		}),
		new CopyWebpackPlugin([
		    { from: './app/app_ghostrunner/page/images', to: 'images' }
		]),
	],
	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js', '.es6', '.jsx']
	},
};
