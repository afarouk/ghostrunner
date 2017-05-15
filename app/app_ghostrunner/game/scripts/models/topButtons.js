/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var TopButtonsModel = Backbone.Model.extend({
    	defaults: {
    		opponentInGame: ''
    	},
        initialize: function() {
            
        }
    });
    return TopButtonsModel;
});
