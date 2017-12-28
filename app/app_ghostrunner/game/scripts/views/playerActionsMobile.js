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
			'click .action-button': 'onAction',
			'click .choise-button': 'onChoise',
			'click .move-to-center': 'moveToCenter',
			'click .move-to-right': 'moveToRight',
			'click .move-to-left': 'moveToLeft',
		},
		onRender: function() {
			console.log(this.model.toJSON());
		},
		isEditStarted: function(game) {
			var editStarted = game.get('thisUser').state === 'MAKE_YOUR_MOVE' && 
							  game.get('thisUser').substate === 'SECONDARY_STATE' ? true : false;

			return editStarted;
		},
		serializeData: function() {
			var game = appCache.get('game'),
				buttons = this.model.get('buttons'),
				playerActions = _.where(buttons, {buttonType: 'PLAY_ACTION'}),
				length = playerActions.length - 1,
				actionsPages = [],
				pagesNumber =  Math.floor(length  / 3);
				this.pagesNumber = pagesNumber;
				this.currentPage = pagesNumber;
				_.each(playerActions, function(action, index) {
					var page = pagesNumber - Math.floor((length - index) / 3);
				    if (actionsPages[page]) {
				    	actionsPages[page].push(action);
				    } else {
				    	actionsPages[page] = [action];
				    }
				});
				console.log(actionsPages);
				var templateData = {
					displayText: this.model.get('displayText'),
					actionsPages: actionsPages,
					lineUpActions: _.where(buttons, {buttonType: 'LINEUP_ACTION'}),
					editStarted: this.isEditStarted(game)
				};
			return templateData;
		},
		onAction: function(e) {
			var $target = $(e.currentTarget),
				move = $target.data('move');

			this.trigger('onPlayer:action', move);
		},
		onChoise: function(e) {
			var $target = $(e.currentTarget),
				choise = $target.data('choise');
			if (choise === 'PLAYER_ACTIONS') {
				this.ui.actionsButtons.addClass('move-state');
			} else {
				this.ui.actionsButtons.addClass('edit-state');
			}
		},
		moveToCenter: function() {
			this.ui.actionsButtons.removeClass('move-state');
			this.ui.actionsButtons.removeClass('edit-state');
		},
		//logic not straightforward and clear yet V
		moveToRight: function(e) {
			var $target = $(e.currentTarget),
				page = $target.data('page');
			console.log(page);
			if (page === this.pagesNumber) {
				this.ui.actionsButtons.removeClass('move-state');
				this.currentPage = this.pagesNumber;
			} else {
				this.ui.actionsButtons.removeClass('page-n-' + this.currentPage);
				this.currentPage++;
			}
		},
		moveToLeft: function(e) {
			var $target = $(e.currentTarget),
				page = $target.data('page');
			console.log(page);
			this.currentPage--;

			this.ui.actionsButtons.addClass('page-n-' + this.currentPage);
		}
	});
	return PlayerActionsMobileView;
});