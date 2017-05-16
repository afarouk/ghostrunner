/*global define */

'use strict';

define([
	'ejs!../../templates/partials/invitationForm.ejs',
	'../../globalHelpers'
	], function(template, h){
	var InvitationForm = Mn.View.extend({
		className: 'invitation-by-email',
		template: template,
		ui: {
			email: '[name="email"]',
			phone: '[name="phone"]',
			error: '[name="error"]'
		},
		events: {
			'keyup input': 'validateCredentials',
			'paste input': 'validateCredentials',
			'change input': 'validateCredentials',
			'input input': 'validateCredentials'
		},

		validateCredentials: function() {
			setTimeout(function(){
				var email = this.ui.email.val(),
				phone = this.ui.phone.val(),
				credentials = {
					email: this.validateEmail(email),
					mobile: this.validatePhone(phone)
				};

				if (credentials.email || credentials.mobile) {
					this.trigger('credentials:filled', credentials);
				} else {
					//TODO show sign like one fiels should be filled correct
					this.trigger('credentials:filled', null);
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

		validatePhone: function(phone) {
			if (phone.length < 4 || phone.length > 12) return '';
			return phone;
		},

		onError: function(error) {
			var message = error.responseJSON.error.message;
			this.ui.error.html('&#9888; ' + message);
		}
	});
	return InvitationForm;
});