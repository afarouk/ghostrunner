/*global define */

'use strict';

define([
	'ejs!../templates/gameField.ejs',
	], function(template){
	var GameFieldView = Mn.View.extend({
		template: template,
		className: 'canvas-container',
		onRender: function() {
		}
	});
	return GameFieldView;
});