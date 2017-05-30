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
			'click button': 'onAction'
		},
		behaviors: [maskBehavior],
		onRender: function() {
		},
		onAction: function(e) {
			var $target = $(e.currentTarget),
				action = $target.data('action');

			this.trigger('onPlayer:action', action);
		}
	});
	return PlayerActionsView;
});