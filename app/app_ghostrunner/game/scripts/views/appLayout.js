/*global define */

'use strict';

define([
	'ejs!../templates/appLayout.ejs',
	'./gameLayout'
	], function(template, GameLayout ){
	var AppLayoutView = Mn.View.extend({
		template: template,
		el: '#game-layout',
		regions: {
            game: '#game',
			broker: '#broker',
			modals: '#modals'
		},
		events: {
			'click #expand-btn': 'onExpand'
		},
		onRender: function() {
			this.renderBroker();
		},
		renderBroker: function() {
			this.publicController.getBrokerController().create(this, 'broker');
			this.publicController.getModalsController().create(this, 'modals');
		},
		renderGame: function() {
			var gameLayout = new GameLayout();
			this.showChildView( 'game',  gameLayout);
		},
		destroyView: function() {
			this.undelegateEvents();
            this.$el.removeData().unbind(); 
            this.$el.html('');
            this.setElement(null);
            this.destroy();
		},
		onExpand: function() {
			$('.header-content-wrapper').toggleClass('full_screen_game');
			$('.fa-expand').toggleClass('fa-compress');            
		},
	});
	return AppLayoutView;
});