/*global define */

'use strict';

define([
	'ejs!../templates/chat.ejs',
	], function(template){
	var ChatView = Mn.View.extend({
		template: template,
		onRender: function() {
		}
	});
	return ChatView;
});