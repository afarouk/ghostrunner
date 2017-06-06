/*global define */

'use strict';

define([
	'ejs!../templates/gameLayout.ejs'
	], function(template){
	var GameLayoutView = Mn.View.extend({
		template: template,
		className: 'game-container',
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