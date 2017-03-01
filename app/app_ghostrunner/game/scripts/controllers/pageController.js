/*global define */

'use strict';

define([
    './gameController'
    ], function( gameController ){
    var PageController = Mn.Object.extend({
            listenPage: function(){
                //!!! TODO check if we always start listen before
                // we got autentification status
                $(window).on('ghostrunner.signin', this.onSignin.bind(this));
                $(window).on('ghostrunner.signout', this.onSignout.bind(this));
            },
            onSignin: function(e, user) {
                gameController.start(user);
            },
            onSignout: function(e, UID) {
                gameController.stop(UID);
            }
        });

    return new PageController();
});
