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
			games: '[name="games"]',
			confirm: '[name="confirm"]'
		},
		events: {
			'click @ui.teams': 'onGetTeams',
			// 'click @ui.empty': 'onEmpty',
			'click @ui.invite': 'onGetPlayers',
			'click @ui.games': 'onGetGames',
			'click @ui.confirm': 'onConfirm'
		},
		initialize: function (options) {

		},
		onRender: function() {
			
		},

		onGetTeams: function() {

		},

		onGetPlayers: function() {
			this.trigger('getPlayers');
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