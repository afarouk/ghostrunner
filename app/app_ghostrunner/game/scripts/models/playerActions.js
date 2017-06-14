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
		    			text: 'Pitch to the Batter',
		    			gameMove: 'DUAL1'
		    		},
		    		{
		    			action: 'walk',
		    			text: 'International Walk',
		    			gameMove: 'DUAL2'
		    		},
		    		{
		    			action: 'substitution',
		    			text: 'Defencive Substitution',
		    			gameMove: 'DUAL3'
		    		},
		    		{
		    			action: 'relief',
		    			text: 'Relief Pitcher',
		    			gameMove: 'DUAL4'
		    		}
		    	]
	    	},
	    	DEFENSE: {
	    		displayText: 'Your Team Currently playing Defense',
	    		actions: [
		    		{
		    			action: 'pitch',
		    			text: 'Pitch to the Batter',
		    			gameMove: 'DEFENSE1'
		    		},
		    		{
		    			action: 'walk',
		    			text: 'International Walk',
		    			gameMove: 'DEFENSE2'
		    		},
		    		{
		    			action: 'substitution',
		    			text: 'Defencive Substitution',
		    			gameMove: 'DEFENSE3'
		    		},
		    		{
		    			action: 'relief',
		    			text: 'Relief Pitcher',
		    			gameMove: 'DEFENSE4'
		    		}
		    	]
	    	},

	    	OFFENSE: {
	    		displayText: 'Your Team Currently playing Offense',
	    		actions: [
	    			{
		    			action: 'hit',
		    			text: 'Hit by pitch',
		    			gameMove: 'OFFENSE1'
		    		},
		    		{
		    			action: 'single',
		    			text: 'Single',
		    			gameMove: 'OFFENSE2'
		    		},
		    		{
		    			action: 'double',
		    			text: 'Double',
		    			gameMove: 'OFFENSE3'
		    		},
		    		{
		    			action: 'triple',
		    			text: 'Triple',
		    			gameMove: 'OFFENSE4'
		    		},
		    		{
		    			action: 'run',
		    			text: 'Home run',
		    			gameMove: 'OFFENSE5'
		    		}
	    		]
	    	},
	    	UNDECIDED: {
	    		displayText: 'Undecided/some API issue if you can see it',
	    		actions: [
	    			{
		    			action: 'undecided',
		    			text: 'Undecided issue',
		    			gameMove: 'UNDECIDED'
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
