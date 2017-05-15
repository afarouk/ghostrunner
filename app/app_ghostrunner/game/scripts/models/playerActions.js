/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var PlayerActionsModel = Backbone.Model.extend({
    	roles: {
    		dual: {
	    		displayText: 'Your Team Currently playing Dual',
	    		actions: [
	    			{
	    				action: 'move',
		    			text: 'Move'
	    			},
		    		{
		    			action: 'pitch',
		    			text: 'Pitch to the Batter'
		    		},
		    		{
		    			action: 'walk',
		    			text: 'International Walk'
		    		},
		    		{
		    			action: 'substitution',
		    			text: 'Defencive Substitution'
		    		},
		    		{
		    			action: 'relief',
		    			text: 'Relief Pitcher'
		    		}
		    	]
	    	},
	    	defence: {
	    		displayText: 'Your Team Currently playing Defence',
	    		actions: [
	    			{
	    				action: 'move',
		    			text: 'Move'
	    			},
		    		{
		    			action: 'pitch',
		    			text: 'Pitch to the Batter'
		    		},
		    		{
		    			action: 'walk',
		    			text: 'International Walk'
		    		},
		    		{
		    			action: 'substitution',
		    			text: 'Defencive Substitution'
		    		},
		    		{
		    			action: 'relief',
		    			text: 'Relief Pitcher'
		    		}
		    	]
	    	},

	    	offence: {
	    		displayText: 'Your Team Currently playing Offence',
	    		actions: [
	    			{
	    				action: 'move',
		    			text: 'Move'
	    			},
	    			{
		    			action: 'hit',
		    			text: 'Hit by pitch'
		    		},
		    		{
		    			action: 'single',
		    			text: 'Single'
		    		},
		    		{
		    			action: 'double',
		    			text: 'Double'
		    		},
		    		{
		    			action: 'triple',
		    			text: 'Triple'
		    		},
		    		{
		    			action: 'run',
		    			text: 'Home run'
		    		}
	    		]
	    	},
	    },

        initialize: function(role) {
            this.updateRole(role);
        },

        updateRole: function(role) {
        	if (this.roles[role]) {
        		this.set(this.roles[role]);
        	}
        }
    });
    return PlayerActionsModel;
});
