/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/playerActions.ejs',
	'../controllers/interfaceMaskBehavior'
	], function(Vent, template, maskBehavior){
	var PlayerActionsView = Mn.View.extend({
		template: template,
		events: {
			'click .move': 'onMove'
		},
		behaviors: [maskBehavior],
		onRender: function() {
			console.log('PlayerActionsView');
		},
		onMove: function() {
			this.trigger('onPlayer:move');
		}
	});
	return PlayerActionsView;
});