/*global define */

'use strict';

define([
	'ejs!../templates/mainBroker.ejs'
	], function(template){
	var MainBrokerView = Mn.View.extend({
		className: 'main-broker',
		template: template,
		ui: {
			teams: '[name="teams"]',
			empty: '[name="empty"]',
			invite: '[name="invite"]',
			games: '[name="games"]'
		},
		events: {
			'click @ui.teams': 'onGetTeams',
			// 'click @ui.empty': 'onEmpty',
			'click @ui.teams': 'onGetPlayers',
			'click @ui.teams': 'onGetGames'
		},
		initialize: function (options) {

		},
		onRender: function() {
			
		},

		onGetTeams: function() {

		},

		onGetPlayers: function() {

		},

		onGetGames: function() {

		}

	});
	return MainBrokerView;
});