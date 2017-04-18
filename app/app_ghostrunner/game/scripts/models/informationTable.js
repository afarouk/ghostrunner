/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var InformationTableModel = Backbone.Model.extend({
    	defaults: {
    		opponentInGame: ''
    	},
        initialize: function() {
            
        }
    });
    return InformationTableModel;
});
