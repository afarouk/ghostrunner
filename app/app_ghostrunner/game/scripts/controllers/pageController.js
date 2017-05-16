/*global define */

'use strict';

define([
    '../globalHelpers',
    ], function( h ){
    var PageController = Mn.Object.extend({
        listenPage: function(){
            //!!! TODO check if we always start listen before
            // we got autentification status
            $(window).on('ghostrunner.signin', this.onSignin.bind(this));
            $(window).on('ghostrunner.signout', this.onSignout.bind(this));
        },
        onSignin: function(e, user) {
            this.checkOptions();
            this.publicController.getGameController().start(user);
        },
        onSignout: function(e, UID) {
            this.publicController.getGameController().stop(UID);
        },

        checkOptions: function() {
            var search = Backbone.history.getSearch().replace('?', ''),
                params = h().parseQueryString(search);
            if (params && params.server) {
                config.setAPIRoot(params.server);
            }
            if (params && params.t) {
                this.manageByQueryParams(params);
            }
        },

        manageByQueryParams: function(params) {
            switch (params.t) {
                case 'j':
                    if (params.gameUUID) {
                        this.publicController.getBrokerController().setGameUUID(params.gameUUID);   
                    }
                    break;
                default:
                    break;
            }
        }
    });

    return new PageController();
});
