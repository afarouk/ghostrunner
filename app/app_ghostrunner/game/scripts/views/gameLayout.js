/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/gameLayout.ejs',
	'../controllers/gameFieldController',
	'../controllers/gameInterfaceController'
	], function(Vent, template, gameFieldController, gameInterfaceController){
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
			this.publicController.getFieldController().create(this, 'field');
			this.publicController.getInterfaceController().create(this, 'interface');
		}
	});
	return GameLayoutView;
});