'use strict';

//require game app styles
require('./styles/main.scss');

define([
	'./scripts/app',
	'./scripts/globalHelpers'
	], function(App, h){
	App.start();
	h().startLogger();
});