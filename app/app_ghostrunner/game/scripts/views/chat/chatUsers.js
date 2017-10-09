/*global define */

'use strict';

define([
	'ejs!../../templates/chat/chatUser.ejs'
	], function(template){
	var UserView = Mn.View.extend({
		tagName: 'li',
		className: '',
		template: template,
		modelEvents: {
			'change': 'render'
		},
		triggers: {
			'click': 'user:selected'
		}
	});
	var ChatUsersView = Mn.CollectionView.extend({
		tagName: 'ul',
		className: 'chat-users',
		childView: UserView,
		onChildviewUserSelected: function(view) {
			this.trigger('user:selected', view.model);
		}
	});
	return ChatUsersView;
});