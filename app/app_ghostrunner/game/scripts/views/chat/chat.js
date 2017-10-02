/*global define */

'use strict';

define([
	'ejs!../../templates/chat/chat.ejs',
	], function(template){
	var ChatView = Mn.View.extend({
		template: template,
		regions: {
			modal: '#chat-modal'
		},
		ui: {
			chatBtn: '[name="chat-btn"]',
			messages: '[name="new_messages_number"]',
			modal: '#chat-modal'
		},
		events: {
			'click @ui.chatBtn': 'clickChatBtn'
		},
		messagesNumber: 2, //new messages
		onRender: function() {
			if (this.messagesNumber > 0) {
				this.ui.messages.addClass('shown');
			}
			this.trigger('chat:show', this);
			this.ui.modal.draggable({
				containment: $('#game-layout')
			});
		},
		serializeData: function() {
			//TODO use real data
			// play sound on message send/received
			return _.extend({
				messagesNumber: this.messagesNumber
			});
		},
		clickChatBtn: function() {
			this.ui.modal.show('slow');
			this.ui.chatBtn.hide();

			this.messagesNumber = 0;
		},
		onChildviewChatClose: function() {
			this.ui.modal.hide('slow');
			this.ui.chatBtn.show();
		},
		onChildviewChatBack: function() {
			this.trigger('chat:show', this);
		},
		onResetPosition: function() {
			setTimeout(function(){
				//force reset position
				this.ui.modal
					.hide('slow')
					.css({
						'top': 0,
						'left': 0
					});
				this.ui.chatBtn.show();
			}.bind(this), 100);
		}
	});
	return ChatView;
});