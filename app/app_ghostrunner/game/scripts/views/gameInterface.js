/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/gameInterface.ejs',
	], function(Vent, template){
	var GameInterfaceView = Mn.View.extend({
		template: template,
		onRender: function() {
			console.log('show interface');
		}
	});
	return GameInterfaceView;
});