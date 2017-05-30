/*global define */

'use strict';

define([
	'ejs!../../templates/partials/availableUser.ejs',
	'ejs!../../templates/partials/userByEmail.ejs',
	'../../globalHelpers'
	], function(userTemplate, byEmailTemplate, h){

	var UserByEmailView = Mn.View.extend({
		tagName: 'li',
		className: 'invitation-by-email',
		template: byEmailTemplate,
		ui: {
			email: '[name="email"]',
			error: '[name="error"]'
		},
		events: {
			'keyup input': 'validateCredentials',
			'paste input': 'validateCredentials',
			'change input': 'validateCredentials',
			'input input': 'validateCredentials',
			'click': 'onEmailClicked'
		},
		triggers: {
			'click': 'user:selected'
		},
		onEmailClicked: function() {
			this.ui.email.focus();
		},
		validateCredentials: function() {
			setTimeout(function(){
				var email = this.ui.email.val(),
				credentials = {
					email: this.validateEmail(email)
				};

				if (credentials.email) {
					this.trigger('credentials:filled', this, credentials);
				} else {
					this.trigger('credentials:filled', this, null);
				}
			}.bind(this), 1);
		},

		validateEmail: function(email) {
			if (h().validateEmail(email)) {
				this.ui.error.html('');
				return email;
			}
			return '';
		},

		onError: function(error) {
			var message = error.responseJSON.error.message;
			// this.ui.error.html('&#9888; ' + message);
			//TODO show error popup instead
		}
	});

	var UserView = Mn.View.extend({
		tagName: 'li',
		className: 'available-user',
		template: userTemplate,
		triggers: {
			'click': 'user:selected'
		},
		initialize: function() {
			
		}
	});

	var UsersListView = Mn.CollectionView.extend({
		className: 'users-list',
		tagName: 'ul',
		initialize: function (options) {
		},
		childView: function(model) {
			if (model.get('byEmail')) {
				return UserByEmailView;
			} else {
				return UserView;
			}
		},
		onChildviewUserSelected: function(view) {
			this.children.each(function(childView) {
				if (childView === view) {
					childView.$el.addClass('selected');
				} else {
					childView.$el.removeClass('selected');
				}
			}.bind(this));
			this.trigger('user:selected', view.model);
		},
		onChildviewCredentialsFilled: function(view, creds) {
			this.trigger('user:selected', view.model, creds, view);
		}
	});
	return UsersListView;
});