/*global define */

'use strict';

define([
	'moment',
	'ejs!../../templates/chat/chatMessage.ejs'
	], function(moment, template){
	var MessageView = Mn.View.extend({
		tagName: 'li',
		className: '',
		template: template,
		ui: {
			
		},
		events: {
			
		},
		triggers: {
			
		},
		modelEvents: {
			'check:unread': 'onCheckUnread'
		},
		initialize: function(options) {
			//check if uid and authorId equal
			var me = this.model.get('authorId') === this.options.UID;
			if (me) this.$el.addClass('me');
		},
		onCheckUnread: function($def) {
			//check if message visible
			var blockHeight = 240,
				position = this.$el.position();
			if (position.top > 0 && position.top < blockHeight) {
				$def.resolve(this.model);
			} else {
				$def.resolve(false);
			}
		}
	});
	var ChatMessagesView = Mn.CollectionView.extend({
		tagName: 'ul',
		className: 'chat-messages',
		childView: MessageView,
		childViewOptions: function() {
			return this.options;
		},
		onChildviewMarkAsRead: function(model) {
			this.trigger('markAsRead', model);
		}
	});

	return ChatMessagesView;
});