/*global define */

'use strict';

define([
	'ejs!../../templates/partials/playerChoice.ejs'
	], function(template){
	var PlayerChoiceView = Mn.View.extend({
		className: 'player-choice',
		template: template,
		regions: {
			confirm: '.confirm-choice',
			select: '.select-choice'
		},
		onRender: function() {
			
		}
	});
	return PlayerChoiceView;
});