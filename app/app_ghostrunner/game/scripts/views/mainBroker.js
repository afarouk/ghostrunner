/*global define */

'use strict';

define([
	'ejs!../templates/mainBroker.ejs'
	], function(template){
	var MainBrokerView = Mn.View.extend({
		className: 'main-broker',
		template: template,
		regions: {
			playersList: '#playersList'
		},
		ui: {
			teams: '[name="teams"]',
			empty: '[name="empty"]',
			invite: '[name="invite"]',
			games: '[name="games"]'
		},
		events: {
			'click @ui.teams': 'onGetTeams',
			// 'click @ui.empty': 'onEmpty',
			'click @ui.invite': 'onGetPlayers',
			'click @ui.games': 'onGetGames'
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

		}

	});
	return MainBrokerView;
});