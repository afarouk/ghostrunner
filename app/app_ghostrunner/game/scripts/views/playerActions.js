/*global define */

'use strict';

define([
	'ejs!../templates/playerActions.ejs',
	], function(template, maskBehavior){
	var PlayerActionsView = Mn.View.extend({
		template: template,
		className: 'player-actions-container',
		modelEvents: {
            'change': 'render'
        },
		events: {
			'click button': 'onAction'
		},
		onRender: function() {
			console.log(this.model.toJSON());
		},
		onAction: function(e) {
			var $target = $(e.currentTarget),
				move = $target.data('move');

			this.trigger('onPlayer:action', move);
		}
	});
	return PlayerActionsView;
});