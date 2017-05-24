/*global define */

'use strict';

define([
    '../appConfig',
    '../globalHelpers',
    ], function( config, h ){
    var UrlController = Mn.Object.extend({
        checkOptions: function() {
            var search = Backbone.history.getSearch().replace('?', ''),
                params = h().parseQueryString(search);
            if (params) {
                if(params.server) {
                    config.setBaseRoot(params.server);
                }
                this.checkType(params);
            }
        },

        checkType: function(params) {
            var type = params.t;
            switch (type) {
                case 'j':
                    if (params.gameUUID) {
                        this.publicController.getBrokerController().setGameUUID(params.gameUUID);   
                    }
                    break;
                case 'e':
                    //Events
                    break;
                case 'd':
                    //Discounts
                    break;
                case 'y':
                    //Loyalty block
                    break;
                case 'h':
                    //Photo contest
                    break;
                case 'l':
                    //Poll contest
                    break;
                case 'p':
                    //Promotions
                    break;
                default:
                    break;
            };
        },
    });

    return new UrlController();
});
