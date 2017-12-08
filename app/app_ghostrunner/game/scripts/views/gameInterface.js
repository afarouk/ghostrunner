/*global define */

'use strict';

define([
	'ejs!../templates/gameInterface.ejs',
	'../appCache'
	], function(template, appCache){
	var GameInterfaceView = Mn.View.extend({
		template: template,
		regions: {
			informationTable: '#informationTable',
			playerActions: '#playerActions',
			chat: '#chat'
		},
		ui: {
			playerActions: '#playerActions'
		},
		onRender: function() {
			this.renderInterfaceParts();
		},
		renderInterfaceParts: function() {
			this.publicController.getInformationTableController().create(this, 'informationTable');
			this.publicController.getPlayerActionsController().create(this, 'playerActions');
			// this.publicController.getChatController().create(this, 'chat');
		},
		onShowLoader: function(type) {
			var gameModel = appCache.get('game'),
				role = gameModel.get('thisUser').role;
			if (type) {
				this.$('.loader').hide();
				this.ui.playerActions.addClass('waiting');
				if (role === 'OFFENSE') {
					this.ui.playerActions.addClass('offense');
				}
				this.$('.waiting-msg').show();
			} else {
				this.$('.waiting-msg').hide();
				this.ui.playerActions.removeClass('waiting offense');
				this.$('.loader').show();
			}
		},
		onHideLoader: function() {
			this.$('.loader').hide();
			this.ui.playerActions.removeClass('waiting offense');
			this.$('.waiting-msg').hide();
		}
	});
	return GameInterfaceView;
});