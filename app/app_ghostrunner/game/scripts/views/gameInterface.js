/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/gameInterface.ejs'
	], function(Vent, template){
	var GameInterfaceView = Mn.View.extend({
		template: template,
		regions: {
			informationTable: '#informationTable',
			playerActions: '#playerActions',
			chat: '#chat'
		},
		onRender: function() {
			console.log('show interface');
			this.renderInterfaceParts();
		},
		renderInterfaceParts: function() {
			this.publicController.getInformationTableController().create(this, 'informationTable');
			this.publicController.getPlayerActionsController().create(this, 'playerActions');
			this.publicController.getChatController().create(this, 'chat');
		},
		onShowLoader: function() {
			console.log('show loader');
			this.$('.loader').show();
		},
		onHideLoader: function() {
			console.log('hide loader');
			this.$('.loader').hide();
		},
		onShowTossAnimation: function() {
			console.log('show toss animation');
			this.$('.toss').addClass('begin');
		}
	});
	return GameInterfaceView;
});