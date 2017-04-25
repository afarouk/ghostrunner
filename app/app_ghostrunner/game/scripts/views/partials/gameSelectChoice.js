/*global define */

'use strict';

define([
	'ejs!../../templates/partials/gameSelectChoice.ejs'
	], function(template){
	var GameSelectChoice = Mn.View.extend({
		className: 'game-select-choice',
		template: template,
		ui: {
			select: 'select'
		},
		events: {
			'click button': 'onConfirmed'
		},
		onRender: function() {
			
		},
		onConfirmed: function() {
			var gameUUID = this.ui.select.val();			
			this.model.get('callback')(gameUUID);
		}
	});
	return GameSelectChoice;
});