/*global define */

'use strict';

define([
	'ejs!../templates/gameInterface.ejs'
	], function(template){
	var GameInterfaceView = Mn.View.extend({
		template: template,
		regions: {
			informationTable: '#informationTable',
			playerActions: '#playerActions',
			chat: '#chat'
		},
		onRender: function() {
			this.renderInterfaceParts();
		},
		renderInterfaceParts: function() {
			this.publicController.getInformationTableController().create(this, 'informationTable');
			this.publicController.getPlayerActionsController().create(this, 'playerActions');
			this.publicController.getChatController().create(this, 'chat');
		},
		onShowLoader: function() {
			this.$('.loader').show();
		},
		onHideLoader: function() {
			this.$('.loader').hide();
		},
		onShowTossAnimation: function() {
			console.log('show toss animation');
			this.$('.toss').addClass('begin');
		}
	});
	return GameInterfaceView;
});