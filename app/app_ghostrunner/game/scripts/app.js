'use strict';

define([
	'./actions/sessionActions',
	'./controllers/pageController',
	'./controllers/userController',
	'./controllers/gameController'
	], function(sessionActions, pageController, userController, gameController){
	var App = new Mn.Application();
	App.on('start',function() {
    	Backbone.history.start({pushState: true});

    	pageController.listenPage();

    	if (localStorage.cmxUID) {
	        sessionActions.getSessionFromLocalStorage().then(function () {
	            //TODO
	        });
	    }
	});
	return App;
});