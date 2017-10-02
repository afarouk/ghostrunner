/*global define */

'use strict';

define([
	'ejs!../../templates/chat/chatUsersModal.ejs',
	'./chatUsers'
	], function(template, ChatUsersView){
	var ChatUsersModalView = Mn.View.extend({
		template: template,
		regions: {
			users: '[name="chat-users"]'
		},
		ui: {
			close: 'button.close'
		},
		events: {
			
		},
		triggers: {
			'click @ui.close': 'chat:close'
		},
		onRender: function() {
			this.onShowUsers();
		},
		onShowUsers: function() {
			var users = new ChatUsersView({
				collection: this.options.collection
			});
			this.showChildView( 'users', users );
			this.listenTo(users, 'user:selected', this.onUserSelected.bind(this));
		},
		onUserSelected: function(model) {
			this.trigger('user:selected', model);
		}
	});
	return ChatUsersModalView;
});