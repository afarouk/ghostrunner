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
			var messageFrom = message.messageFromUserToUser,
				autor = users.findWhere({
					uid: messageFrom.authorId
				}),
				lastMessageState = autor.get('lastMessageState'),
				unReadMessageCount = autor.get('unReadMessageCount');
			autor.set({
				lastMessage: messageFrom.messageBody,
				timeStamp: messageFrom.timeStamp,
				unReadMessageCount: ++unReadMessageCount
			});
			lastMessageState.enumText = 'UNREAD';
			lastMessageState.displayText = 'UNREAD';
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
			this.chatProxy.set(this.addMessage.bind(this, messages));
			modal.triggerMethod('scrollBottom');
		},
		onMarkAsRead: function(forMark) {
			var payload,
				idList;
			idList = forMark.map(function(model){
				return {
					communicationId: model.get('communicationId'),
					messageId: model.get('messageId')
				}
			});
			if (forMark.length > 1) {
				payload = {
					idList: idList
				};
			} else {
				payload = {
					communicationId: idList[0].communicationId,
    				messageId: idList[0].messageId,
				};
			}
			service.markAsReadUser({
				payload: payload
			}).then(function(response){
				forMark.forEach(function(model){
					var state = model.get('state');
					state.enumText = 'READ';
					state.displayText = 'Read';
				});
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		onChatScrolled: function(messages) {
			var allDefs = [];
			messages.each(function(model){
				var unread = model.get('state').enumText === 'UNREAD',
					$def = $.Deferred();
				if (unread) {
					allDefs.push($def);
					model.trigger('check:unread', $def);
				}
			});
			//mark bunch of messages
			$.when.apply(this, allDefs).done(function(){
				var forMark = [];
				for (var i = 0; i < arguments.length; i++) {
					var model = arguments[i];
					if (model) {
						forMark.push(model);
					};
				}
				//get from models
				if (forMark.length) {
					this.onMarkAsRead(forMark);
				}
			}.bind(this));
		},
		addMessage: function(messages, message) {
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
                view.ui.input.val('').keydown();
                view.triggerMethod('scrollBottom');
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
