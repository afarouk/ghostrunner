/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var PlayerActionsModel = Backbone.Model.extend({
    	roles: {
    		DUAL: {
	    		displayText: 'Your Team Currently playing Dual',
	    		actions: [
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
	    	DEFENSE: {
	    		displayText: 'Your Team Currently playing Defense',
	    		actions: [
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

	    	OFFENSE: {
	    		displayText: 'Your Team Currently playing Offense',
	    		actions: [
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
	    	UNDECIDED: {
	    		displayText: 'Undecided/some API issue if you can see it',
	    		actions: [
	    			{
		    			action: 'undecided',
		    			text: 'Undecided issue'
		    		}
	    		]

	    	}
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
