/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/chat.ejs',
	], function(Vent, template){
	var ChatView = Mn.View.extend({
		template: template,
		onRender: function() {
		}
	});
	return ChatView;
});