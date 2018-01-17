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
			'paste input': 'validateCredentials',
			'change input': 'validateCredentials',
			'keydown': 'onCheckEnter',
			'blur input': 'validateCredentials',
			'click': 'onEmailClicked'
		},
		triggers: {
			'click': 'user:selected'
		},
		onEmailClicked: function() {
			this.ui.email.focus();
			if (this.ui.email.val() !== '') this.validateCredentials();
		},
		onCheckEnter: function(e) {
			if (e.keyCode === 13) {
				this.validateCredentials();
			} else {
				return true;
			}
		},
		validateCredentials: function() {
			setTimeout(function(){
				var value = this.ui.email.val(),
				credentials = this.validateField(value);

				if (credentials.email || credentials.mobile) {
					this.trigger('credentials:filled', this, credentials);
				} else {
					this.trigger('credentials:filled', this, null);
				}
			}.bind(this), 1);
		},

		validateField: function(value) {
			if (h().validateMobile(value)) {
				this.ui.error.html('');
				return {
					email: null,
					mobile: value // 1 650 304 6414
				};
			} else if (h().validateEmail(value)) {
				this.ui.error.html('');
				return {
					email: value,
					mobile: null
				};
			} else {
				this.ui.error.html('&#9888; please, type correct email.');
				return {
					email: null,
					mobile: null
				};
			}
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