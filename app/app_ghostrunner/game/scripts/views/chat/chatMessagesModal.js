/*global define */

'use strict';

define([
	'ejs!../../templates/chat/chatMessagesModal.ejs',
	'./chatMessages'
	], function(template, ChatMessagesView){
	var ChatMessagesModalView = Mn.View.extend({
		template: template,
		regions: {
			messages: '[name="chat-messages"]'
		},
		ui: {
			close: 'button.close',
			back: 'button.back',
			message: '[name="message"]',
			send: '[name="send"]',
			input: '.message-input',
			text: '.message-text'
		},
		events: {
			'keydown @ui.input': 'onKeyPressed',
			'paste @ui.input': 'onKeyPressed',
			'cut @ui.input': 'onKeyPressed'
		},
		triggers: {
			'click @ui.close': 'chat:close',
			'click @ui.back': 'chat:back',
			'click @ui.send': 'chat:send'
		},
		serializeData: function() {
			return {
				otherUserName: this.options.otherUserName
			};
		},
		onRender: function() {
			this.onShowMessages();
		},
		onShowMessages: function() {
			var messages = new ChatMessagesView({
				collection: this.options.collection
			});
			this.showChildView( 'messages', messages );
		},

		//prepare behavior from it
		onKeyPressed: function() {
			setTimeout(function(){
				var val = this.ui.input.val();
				this.ui.text.html(val.replace(/\n/g, '<br/>'));
				var lht = parseInt(this.ui.text.css('lineHeight'), 10);
				var lines = Math.round(this.ui.text.prop('scrollHeight') / lht) || 1;
				if (val.slice(-1) === '\n') lines++;
				if (lines > 5) {
					this.ui.message.addClass('long');
				} else {
					this.ui.message.removeClass('long');
				}
				this.ui.message.css('height', lines * 20 + 'px');
			}.bind(this), 0);
			return true;
		}
	});
	return ChatMessagesModalView;
});