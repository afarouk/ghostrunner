/*global define */

'use strict';

define([
	'ejs!../../templates/chat/chatMessage.ejs'
	], function(template){
	var MessageView = Mn.View.extend({
		tagName: 'li',
		className: '',
		template: template,
		ui: {
			
		},
		events: {
			
		},
		triggers: {
			
		}
	});
	var ChatMessagesView = Mn.CollectionView.extend({
		tagName: 'ul',
		className: 'chat-messages',
		childView: MessageView
	});

	return ChatMessagesView;
});