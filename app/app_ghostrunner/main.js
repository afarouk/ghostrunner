'use strict';

//require index page
require('./index');

define([
	'./scripts/app',
	'./scripts/globalHelpers'
	], function(App, h){
	App.start();
	h().startLogger();
});