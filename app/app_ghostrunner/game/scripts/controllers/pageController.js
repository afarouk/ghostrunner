/*global define */

'use strict';

define([
    '../actions/sessionActions',
    './userController',
    './gameController'
    ], function(sessionActions, userController, gameController){
    var PageController = Mn.Object.extend({
            listenPage: function(){
               $(window).on('ghostrunner.signin', this.onSignin.bind(this));
               $(window).on('ghostrunner.signout', this.onSignout.bind(this));
            },
            onSignin: function(e, params) {
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
            },
            onSignout: function() {
                
            }
        });

    return new PageController();
});
