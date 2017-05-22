/*global define */

'use strict';

define([
	'../../Vent',
	'ejs!../../templates/partials/teamCreation.ejs',
	'./teamPlayersList'
	], function(Vent, template, TeamPlayersList){
	var TeamCreationView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-team',
		regions: {
			players: '.players-list-container table'
		},
		onRender: function() {
			console.log('team creation');
			var teamPlayersList = new TeamPlayersList({
				collection: this.options.players,
				positions: this.options.positions
			});
			this.showChildView('players', teamPlayersList);
		}
	});
	return TeamCreationView;
});