'use strict';

define([
	'./controllers/pageController',
	'./controllers/gameController',
	], function(pageController, gameController){
	var App = new Mn.Application({
		onStart: function() {
			Backbone.history.start({pushState: true});

	    	pageController.listenPage();
		}
	});
	return App;
});