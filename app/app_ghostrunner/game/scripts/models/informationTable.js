/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var InformationTableModel = Backbone.Model.extend({
    	defaults: {
    		opponentInGame: false
    	},
        initialize: function() {
            
        }
    });
    return InformationTableModel;
});
