/*global define */

'use strict';

define([
	'../appCache',
	'../APIGateway/gameService',
    '../views/chat/chat',
    '../views/chat/chatUsersModal',
    '../views/chat/chatMessagesModal',
    '../models/messagesCollection',
    ], function(appCache, service, 
    	ChatView, ChatUsersModalView, ChatMessagesModalView, MessagesCollection){
    var ChatController = Mn.Object.extend({
    	initialize: function() {
    		this.chatProxy = this._chatProxy();
    	},
		create: function(layout, region) {
			this.view = new ChatView();
			this.listenTo(this.view, 'chat:show', this.onChatShow.bind(this));
			layout.showChildView( region, this.view );
		},
		resetPosition: function() {
			this.view.triggerMethod('resetPosition');
		},

		onChatShow: function() {
			this.getChatUsers();
		},

		showLoader: function() {
			this.view.ui.loader.addClass('show');
		},

		hideLoader: function() {
			this.view.ui.loader.removeClass('show');
		},

		getChatUsers: function() {
			this.showLoader();
			service.getAvailableUsers({
				forChat: true
			}).then(function(response){
				this.hideLoader();
                if (response.count > 0) {
                    this.createChatUsersModal(response);
                } else {
                    // this.showEmptyList('leftList', 'No users are present.');
                }
            }.bind(this), function(xhr){
            	this.hideLoader();
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		createChatUsersModal: function(response) {
			//TODO add counter also,
			//calculate total count, etc
			var users = new Backbone.Collection(response.users),
				modal = new ChatUsersModalView({
				collection: users
			});
			this.view.showChildView( 'modal', modal );
			this.listenTo(modal, 'user:selected', this.onUserSelected.bind(this));
			this.chatProxy.set(this.messageFromUser.bind(this, users));
		},
		messageFromUser: function(users, message) {
			//TODO update last message from user, count and time
			//recalculate total
			debugger;
		},
		onUserSelected: function(model) {
			var otherUserName = model.get('userName');
			this.showLoader();
			service.getConversationBetweenUsers({
				otherUserName: otherUserName
			}).then(function(conversation){
				this.hideLoader();
                var messages = new MessagesCollection(conversation.messages);
                this.createMessagesModal(otherUserName, messages);
            }.bind(this), function(xhr){
            	this.hideLoader();
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		createMessagesModal: function(otherUserName, messages) {
			var modal = new ChatMessagesModalView({
					otherUserName: otherUserName,
					collection: messages
				});
			this.view.showChildView( 'modal', modal );
			this.listenTo(modal, 'chat:send', this.onMessageSend.bind(this, otherUserName, messages));
			this.listenTo(modal, 'chat:scrolled', this.onChatScrolled.bind(this, messages));
			this.listenTo(modal, 'markAsRead', this.onMarkAsRead.bind(this));
			this.chatProxy.set(this.addMessage.bind(this, messages));
			modal.triggerMethod('scrollBottom');
		},
		onMarkAsRead: function(model) {
			service.markAsReadUser({
				payload: {
					communicationId: model.get('communicationId'),
    				messageId: model.get('messageId'),
    				stateEnum : 'READ'
				}
			}).then(function(response){
				model.get('state').enumText = 'READ';
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		onChatScrolled: function(messages) {
			messages.each(function(model){
				var unread = model.get('state').enumText === 'UNREAD';
				if (unread) {
					model.trigger('check:unread');
				}
			});
		},
		addMessage: function(messages, message) {
			//TODO maybe scroll down in some cases ???
			messages.add(message.messageFromUserToUser);
		},
		onMessageSend: function(otherUserName, messages, view) {
			this.showLoader();
			var message = view.ui.input.val();
			if (!message) return;
			service.sendMessageFromUserToUser({
				payload: {
					messageBody: message,
				    urgent: false,
				    userName: otherUserName
				} 
			}).then(function(response){
				this.hideLoader();
                messages.add(response);
                //TODO scroll down after that ???
                view.ui.input.val('').keydown();
            }.bind(this), function(xhr){
            	this.hideLoader();
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));

		},
		_chatProxy: function(){
			var handler = function(){};
			return {
				set: function(h) {
					handler = h;
				},
				handle: function(message) {
					handler(message);
				}
			}
		},
		onChatSignal: function(message) {
			switch (message.signal) {
				case 'MESSAGE_RECEIVED':
					this.chatProxy.handle(message);
					break;
			}
		}
    });

    return new ChatController();
});
