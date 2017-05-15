/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/playerActions.ejs',
	'../controllers/game/interfaceMaskBehavior'
	], function(Vent, template, maskBehavior){
	var PlayerActionsView = Mn.View.extend({
		template: template,
		modelEvents: {
            'change': 'render'
        },
		events: {
			'click .move': 'onMove'
		},
		behaviors: [maskBehavior],
		onRender: function() {
			console.log('PlayerActionsView');
			console.log(this.model.toJSON());
		},
		onMove: function() {
			this.trigger('onPlayer:move');
		}
	});
	return PlayerActionsView;
});