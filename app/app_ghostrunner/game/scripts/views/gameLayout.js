/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/gameLayout.ejs'
	], function(Vent, template){
	var GameLayoutView = Mn.View.extend({
		template: template,
		regions: {
            btn: '#game-btn',
			field: '#game-field',
			interface: '#game-interface'
		},
		onRender: function() {
			this.renderGame();
		},
		renderGame: function() {
			this.publicController.getFieldController().create(this, 'field');
			this.publicController.getInterfaceController().create(this, 'interface');
            this.publicController.getGameBtnController().create(this, 'btn');
		}
	});
	return GameLayoutView;
});