/*global define */

'use strict';

define([
	'ejs!../templates/gameField.ejs',
	], function(template){
	var GameFieldView = Mn.View.extend({
		template: template,
		className: 'field-container',
		ui: {
			field: '[name="game-field"]',
			player: '.player'
		},
		events: {
			'contextmenu @ui.player': 'onContextMenu',
			'contextmenu': 'onPreventContextMenu'
		},
		modelEvents: {
			'change': 'render'
		},
		onRender: function() {

		},
		onInitContext: function() {
			// var field = this.ui.field.get(0),
			// 	context = field.getContext('2d');
			// context.fillStyle = 'rgba(10,200,20, 0.5)'
			// context.fillRect(0, 0, 1000, 1000)
		},
		onPreventContextMenu: function(e) {
			e.preventDefault();
			return false;
		},
		onContextMenu: function(e) {
			var $target = $(e.currentTarget),
				enumText = $target.data('enum'),
				player = this.model.get(enumText);
			e.preventDefault();
			console.log(player);
			this.trigger('onPlayerCard', player);
			return false;
		},

	});
	return GameFieldView;
});