/*global define */

'use strict';

define([
	'ejs!../templates/playerActions.ejs',
	], function(template, maskBehavior){
	var PlayerActionsView = Mn.View.extend({
		template: template,
		modelEvents: {
            'change': 'render'
        },
		events: {
			'click button': 'onAction'
		},
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