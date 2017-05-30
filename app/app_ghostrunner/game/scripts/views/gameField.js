/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/gameField.ejs',
	], function(Vent, template){
	var GameFieldView = Mn.View.extend({
		template: template,
		className: 'canvas-container',
		onRender: function() {
		}
	});
	return GameFieldView;
});