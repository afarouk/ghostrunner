'use strict';

define([
	'./controllers/publicController'
	], function(publicController){
	var App = new Mn.Application({
		onStart: function() {
			Backbone.history.start({pushState: true});

	    	publicController.getPageController().listenPage();
		}
	});

	//Fix requirejs circular issue
    //when it returns empty object second time
    Mn.Object.prototype.App = App;
	Mn.Object.prototype.publicController = publicController;
	Mn.View.prototype.publicController = publicController;

	return App;
});