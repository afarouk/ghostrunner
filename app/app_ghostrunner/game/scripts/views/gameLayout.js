/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/gameLayout.ejs',
	'./gameField',
	'./gameInterface'
	], function(Vent, template, GameFieldView, GameInterfaceView){
	var GameLayoutView = Mn.View.extend({
		template: template,
		el: '#game-layout',
		regions: {
			field: '#game-field',
			interface: '#game-interface'
		},
		onRender: function() {
			this.renderGame();
		},
		renderGame: function() {
			this.showChildView('field', new GameFieldView());
			this.showChildView('interface', new GameInterfaceView());
		}
	});
	return GameLayoutView;
});