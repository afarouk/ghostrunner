'use strict';

define([
	'./actions/sessionActions',
	'./controllers/userController',
	'./controllers/gameController'
	], function(sessionActions, userController, gameController){
	var App = new Mn.Application();
	App.on('start',function() {
    	Backbone.history.start({pushState: true});

    	$(window).on('ghostrunner.signin', function(e, params){
    		console.log(params);
    		sessionActions.startSession(params.username, params.password)
				.then(function(response) {
					//TODO on start session
					gameController.start();
					debugger;
				}.bind(this), function(jqXHR) {
                if( jqXHR.status === 400 ) {
                    params.callback('error');
                }else{
                    params.callback('success');
                }
            }.bind(this));
    	});

    	if (localStorage.cmxUID) {
	        sessionActions.getSessionFromLocalStorage().then(function () {
	            
	        });
	    }
	});
	return App;
});

//
// submitSignin: function() {
//         loader.show('');
//         sessionActions.startSession(this.popup.val().username, this.popup.val().password)
//             .then(function(response) {
//                 loader.showFlashMessage( 'successfully signed in as ' + response.username );
//                 this.popup.close();
//                 App.trigger('login_success');
//                 this.navigateToFeed();
//             }.bind(this), function(jqXHR) {
//                 if( jqXHR.status === 400 ) {
//                     this.popup.showLoginError();
//                     loader.hide();
//                 }else{
//                     loader.showFlashMessage(h().getErrorMessage(jqXHR, 'Error signin in'));
//                 }
//             }.bind(this));
//         return false;
//     },