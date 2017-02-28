/*global define */

'use strict';

define([
    './gameController'
    ], function( gameController ){
    var PageController = Mn.Object.extend({
            listenPage: function(){
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
