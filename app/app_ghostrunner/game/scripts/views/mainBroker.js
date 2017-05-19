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
			rightList: '#right-list'
		},
		ui: {
			leftBroker: '.left-broker',
			rightBroker: '.right-broker',
			teams: '[name="teams"]',
			empty: '[name="empty"]',
			invite: '[name="invite"]',
			byemail: '[name="byemail"]',
			games: '[name="games"]',
			createTeam: '[name="create-team"]',
			teamConfirm: '[name="team-confirm"]',
			confirm: '[name="confirm"]',
		},
		events: {
			'click @ui.teams': 'onGetTeams',
			// 'click @ui.empty': 'onEmpty',
			'click @ui.invite': 'onGetUsers',
			'click @ui.byemail': 'onInviteByEmail',
			'click @ui.games': 'onGetGames',
			'click @ui.createTeam': 'onCreateTeam',
			'click @ui.teamConfirm': 'onTeamConfirm',
			'click @ui.confirm': 'onConfirm'
		},
		initialize: function (options) {

		},
		onRender: function() {
			
		},

		onGetTeams: function() {
			this.trigger('getTeams');
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
			//TODO make difference between left and right parts
			this.trigger('confirm');
		},

		onTeamConfirm: function() {
			this.trigger('team:confirm');
		},

		onCreateTeam: function() {
			this.trigger('team:create');
		}

	});
	return MainBrokerView;
});