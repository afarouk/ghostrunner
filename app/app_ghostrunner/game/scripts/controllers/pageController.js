/*global define */

'use strict';

define([
    ], function( ){
    var PageController = Mn.Object.extend({
        listenPage: function(){
            $(window).on('ghostrunner.signin', this.onSignin.bind(this));
            $(window).on('ghostrunner.signout', this.onSignout.bind(this));
        },
        onSignin: function(e, user) {
            this.publicController.getUrlController().checkOptions();
            this.publicController.getGameController().start(user);
        },
        onSignout: function(e, UID) {
            this.publicController.getGameController().stop(UID);
        }
    });

    return new PageController();
});
