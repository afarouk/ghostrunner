'use strict';

//require game app styles
// require('./styles/desktop.scss');
// require('./styles/mobile.scss');

define([
	'./scripts/app',
	'./scripts/globalHelpers'
	], function(App, h){
	App.start();
	h().startLogger();
});