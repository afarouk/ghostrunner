'use strict';

define([
	'./controllers/pageController',
	'./controllers/gameController'
	], function(pageController, gameController){
	var App = new Mn.Application();
	App.on('start',function() {
    	Backbone.history.start({pushState: true});

    	pageController.listenPage();
	});
	return App;
});