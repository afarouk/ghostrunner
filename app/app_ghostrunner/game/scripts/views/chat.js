/*global define */

'use strict';

define([
	'ejs!../templates/chat.ejs',
	], function(template){
	var ChatView = Mn.View.extend({
		template: template,
		ui: {
			chatBtn: '[name="chat-btn"]',
			messages: '[name="new_messages_number"]'
		},
		events: {
			'click @ui.chatBtn': 'clickChatBtn'
		},
		messagesNumber: 2, //new messages
		onRender: function() {
			if (this.messagesNumber > 0) {
				this.ui.messages.addClass('shown');
			}
		},
		serializeData: function() {
			//TODO use real data
			// play sound on message send/received
			return _.extend({
				messagesNumber: this.messagesNumber
			});
		},
		clickChatBtn: function() {
			var $target = $('#chat-content .draggable');
			$target.show('slow');
			this.ui.chatBtn.hide();
			$target.draggable({
				containment: $('#game-layout')
			}).find('.close').on('click', function() {
				$target.hide('slow');
				this.ui.chatBtn.show();
			}.bind(this));

			this.messagesNumber = 0;
			this.render();
		},
		onResetPosition: function() {
			var $target = $('#chat-content .draggable');

			setTimeout(function(){
				//force reset position
				$target
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