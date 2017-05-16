/*global define */

'use strict';

define([
	'ejs!../templates/mainBroker.ejs'
	], function(template){
	var MainBrokerView = Mn.View.extend({
		className: 'main-broker',
		template: template,
		regions: {
			rightList: '#right-list'
		},
		ui: {
			teams: '[name="teams"]',
			empty: '[name="empty"]',
			invite: '[name="invite"]',
			byemail: '[name="byemail"]',
			games: '[name="games"]',
			confirm: '[name="confirm"]'
		},
		events: {
			'click @ui.teams': 'onGetTeams',
			// 'click @ui.empty': 'onEmpty',
			'click @ui.invite': 'onGetUsers',
			'click @ui.byemail': 'onInviteByEmail',
			'click @ui.games': 'onGetGames',
			'click @ui.confirm': 'onConfirm'
		},
		initialize: function (options) {

		},
		onRender: function() {
			
		},

		onGetTeams: function() {

		},

		onGetUsers: function() {
			this.trigger('getUsers');
		},

		onInviteByEmail: function() {
			this.trigger('inviteByEmail');
		},

		onGetGames: function() {
			this.trigger('getGames');
		},

		onConfirm: function() {
			this.trigger('confirm');;
		}

	});
	return MainBrokerView;
});