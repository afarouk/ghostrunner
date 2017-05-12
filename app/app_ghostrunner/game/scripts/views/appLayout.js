/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/appLayout.ejs',
	'./gameLayout',
	'./brokerLayout'
	], function(Vent, template, GameLayout, BrokerLayout ){
	var AppLayoutView = Mn.View.extend({
		template: template,
		el: '#game-layout',
		regions: {
            game: '#game',
			broker: '#broker',
			modals: '#modals'
		},
		events: {
			'click .expand-btn': 'onExpand'
		},
		onRender: function() {
			this.renderGame();
		},
		renderGame: function() {
			var gameLayout = new GameLayout();
			var brokerLayout = new BrokerLayout();
			this.showChildView( 'game',  gameLayout);
			this.showChildView( 'broker',  brokerLayout);

			this.publicController.getModalsController().create(this, 'modals');
		},
		destroyView: function() {
			this.undelegateEvents();
            this.$el.removeData().unbind(); 
            this.$el.html('');
            this.setElement(null);
            this.destroy();
		},
		onExpand: function() {
			$('#game-layout').toggleClass('full_screen_game');
			$('.fa-expand').toggleClass('fa-compress');            
		},
	});
	return AppLayoutView;
});