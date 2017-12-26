/*global define */

'use strict';

define([
	'ejs!../templates/playerActionsMobile.ejs',
	'../appCache'
	], function(template, appCache){
	var PlayerActionsMobileView = Mn.View.extend({
		template: template,
		className: 'player-actions-container',
		modelEvents: {
            'change': 'render'
        },
        ui: {
        	actionsButtons: '.actions-buttons'
        },
		events: {
			'click .action-button': 'onAction'
		},
		onRender: function() {
			console.log(this.model.toJSON());
		},
		isEditStarted: function(game) {
			var editStarted = game.get('thisUser').state === 'MAKE_YOUR_MOVE' && 
							  game.get('thisUser').substate === 'SECONDARY_STATE' ? true : false;

			setTimeout(function() {
				if (editStarted) {
					this.ui.actionsButtons.addClass('edit-started');
				} else {

				}
			}.bind(this), 50);
			return editStarted;
		},
		serializeData: function() {
			var game = appCache.get('game'),
				buttons = this.model.get('buttons'),
				templateData = {
					displayText: this.model.get('displayText'),
					playerActions: _.where(buttons, {buttonType: 'PLAY_ACTION'}),
					lineUpActions: _.where(buttons, {buttonType: 'LINEUP_ACTION'}),
					editStarted: this.isEditStarted(game)
				};
			return templateData;
		},
		onAction: function(e) {
			var $target = $(e.currentTarget),
				move = $target.data('move');

			this.trigger('onPlayer:action', move);
		}
	});
	return PlayerActionsMobileView;
});