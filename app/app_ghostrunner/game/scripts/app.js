'use strict';

define([
	'./controllers/publicController',
	'./globalHelpers',
	'./appConfig'
	], function(publicController, h, config){
	var App = new Mn.Application({
		onStart: function() {
			Backbone.history.start({pushState: true});

	    	publicController.getPageController().listenPage();
	    	
	    	this.options.checkOptions();
		},
		checkOptions: function() {
			var search = Backbone.history.getSearch().replace('?', ''),
				params = h().parseQueryString(search);
			if (params && params.server) {
				config.setAPIRoot(params.server);
			}
            if (params && params.gameUUID) {
			 publicController.getSelectController().setGameUUID(params.gameUUID);	
			}
		}
	});

	//Fix requirejs circular issue
    //when it returns empty object second time
    Mn.Object.prototype.App = App;
	Mn.Object.prototype.publicController = publicController;
	Mn.View.prototype.publicController = publicController;

	return App;
});