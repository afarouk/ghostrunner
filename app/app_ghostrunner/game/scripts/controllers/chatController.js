/*global define */

'use strict';

define([
	'../APIGateway/gameService',
    '../views/chat/chat',
    '../views/chat/chatUsersModal',
    '../views/chat/chatMessagesModal'
    ], function(service, ChatView, ChatUsersModalView, ChatMessagesModalView){
    var ChatController = Mn.Object.extend({
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

		getChatUsers: function() {
			service.getAvailableUsers()
                .then(function(response){
                    if (response.count > 0) {
                        this.createChatUsersModal(response);
                    } else {
                        // this.showEmptyList('leftList', 'No users are present.');
                    }
                }.bind(this), function(xhr){
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
		},
		createChatUsersModal: function(response) {
			var modal = new ChatUsersModalView({
				collection: new Backbone.Collection(response.users)
			});
			this.view.showChildView( 'modal', modal );
			this.listenTo(modal, 'user:selected', this.onUserSelected.bind(this));
		},
		onUserSelected: function(model) {
			var otherUserName = model.get('userName');
			service.getConversationBetweenUsers({
				otherUserName: otherUserName
			}).then(function(conversation){
                var messages = new Backbone.Collection(conversation.messages);
                this.createMessagesModal(otherUserName, messages);
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
		},
		createMessagesModal: function(otherUserName, messages) {
			var modal = new ChatMessagesModalView({
				otherUserName: otherUserName,
				collection: messages
			});
			this.view.showChildView( 'modal', modal );
			this.listenTo(modal, 'chat:send', this.onMessageSend.bind(this, otherUserName));
		},
		onMessageSend: function(otherUserName, view) {
			var message = view.ui.input.val();
			if (!message) return;
			service.sendMessageFromUserToUser({
				payload: {
					messageBody: message,
				    urgent: false,
				    userName: otherUserName
				} 
			}).then(function(response){
                debugger
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));

		},
		onChatSignal: function(message) {
			debugger;
		}
    });

    return new ChatController();
});
