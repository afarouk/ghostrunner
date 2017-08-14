/*global define */

'use strict';

define([
	'ejs!../templates/playerActions.ejs',
	'../appCache'
	], function(template, appCache){
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
		serializeData: function() {
			var game = appCache.get('game'),
				buttons = this.model.get('buttons'),
				templateData = {
					displayText: this.model.get('displayText'),
					playerActions: _.where(buttons, {buttonType: 'PLAY_ACTION'}),
					lineUpActions: _.where(buttons, {buttonType: 'LINEUP_ACTION'}),
					editStarted: game.get('thisUser').state === 'MAKE_YOUR_MOVE' && 
						game.get('thisUser').substate === 'SECONDARY_STATE' ? true : false
				};
			return templateData;
		},
		onAction: function(e) {
			var $target = $(e.currentTarget),
				move = $target.data('move');

			this.trigger('onPlayer:action', move);
		}
	});
	return PlayerActionsView;
});