/*global define */

'use strict';

define([
	'ejs!../templates/mainBroker.ejs'
	], function(template){
	var MainBrokerView = Mn.View.extend({
		className: 'main-broker',
		template: template,
		regions: {
			leftList: '#left-list',
			rightList: '#right-list',
			creation: '#creation-region'
		},
		ui: {
			leftBroker: '.left-broker',
			rightBroker: '.right-broker',
			teams: '[name="teams"]',
			lineups: '[name="lineups"]',
			cancel: '[name="cancel"]',
			invite: '[name="invite"]',
			byemail: '[name="byemail"]',
			my_invites: '[name="my_invites"]',
			my_invites_number: '[name="my_invites_number"]',
			my_games: '[name="my_games"]',
			createTeam: '[name="create-team"]',
			teamConfirm: '[name="team-confirm"]',
			confirm: '[name="confirm"]',
			loader: '#broker-loader'
		},
		events: {
			'click': 'onBrokerClicked'
		},
		triggers: {
			'click @ui.lineups': 'getLineups',
			'click @ui.teams': 'getTeams',
			'click @ui.cancel': 'cancel',
			'click @ui.invite': 'getUsers',
			'click @ui.byemail': 'inviteByEmail',
			'click @ui.my_invites': 'getInvites',
			'click @ui.my_games': 'getGames',
			'click @ui.createTeam': 'team:create',
			'click @ui.teamConfirm': 'team:confirm',
			'click @ui.confirm': 'confirm'
		},
		onShowInvitesNumber: function(number) {
			this.ui.my_invites_number.addClass('shown').text(number);
		},
		onBrokerClicked: function() {
			this.trigger('brokerClicked');
		}
	});
	return MainBrokerView;
});