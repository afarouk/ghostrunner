/*global define */

'use strict';

define([
	'ejs!../templates/gameField.ejs',
	], function(template){
	var GameFieldView = Mn.View.extend({
		template: template,
		className: 'field-container',
		ui: {
			field: '[name="game-field"]'
		},
		onRender: function() {

		},
		onInitContext: function() {
			// var field = this.ui.field.get(0),
			// 	context = field.getContext('2d');
			// context.fillStyle = 'rgba(10,200,20, 0.5)'
			// context.fillRect(0, 0, 1000, 1000)
		}
	});
	return GameFieldView;
});