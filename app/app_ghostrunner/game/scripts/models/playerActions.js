/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var PlayerActionsModel = Backbone.Model.extend({
    	roles: {
    		DUAL: {
	    		displayText: 'Your Team Currently playing Dual',
	    		buttons: null
	    	},
	    	DEFENSE: {
	    		displayText: 'Your Team Currently playing Defense',
	    		buttons: null
	    	},

	    	OFFENSE: {
	    		displayText: 'Your Team Currently playing Offense',
	    		buttons: null
	    	},
	    	UNDECIDED: {
	    		displayText: 'Undecided/some API issue if you can see it',
	    		buttons: null
	    	}
	    },

        initialize: function() {
            this.updateRole();
        },

        updateRole: function() {
        	var gameModel = appCache.get('game'),
        		role = gameModel.get('thisUser').role,
                buttons = gameModel.get('buttons'),
        		userAction = this.roles[role];
        	if (userAction) {
        		userAction.buttons = buttons;
        		this.set(userAction);
        	}
        }
    });
    return PlayerActionsModel;
});
