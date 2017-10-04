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
		onCheckUnread: function() {
			var position = this.$el.position();
			//TODO check parent height (hardcoded 240)
			if (position.top > 0 && position.top < 240) {
				console.log(position);
				console.log('mark as read');
				this.trigger('markAsRead', this.model);
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