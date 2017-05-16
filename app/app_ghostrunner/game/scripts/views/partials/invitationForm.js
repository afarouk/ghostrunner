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
			phone: '[name="phone"]'
		},
		events: {
			'change @ui.email': 'onEmailChange',
			'change @ui.phone': 'onPhoneChange',
		},
		onEmailChange: function() {
			var email = this.ui.email.val();
			console.log(email);
			if (h().validateEmail(email)) {
				this.trigger('credentials:filled', email);
			} else {
				//TODO show validation error
			}
		},
		onPhoneChange: function() {
			var phone = this.ui.phone.val();
			console.log(phone);
			//TODO validate phone etc...
		}
	});
	return InvitationForm;
});