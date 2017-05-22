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
		ui: {
			name: '[name="team-name"]',
			balance: '[name="balance"]',
			save: '[name="save"]'
		},
		events: {
			'change @ui.name': 'onNameChanged',
			'click @ui.save': 'onSave'
		},
		teamName: '',
		initialize: function(options) {
			this.team = options.team;
			this.team.on('change add remove', this.checkIfSaveAllowed, this);
		},
		onRender: function() {
			console.log('team creation');
			var teamPlayersList = new TeamPlayersList({
				collection: this.options.players,
				positions: this.options.positions
			});
			this.showChildView('players', teamPlayersList);
			this.listenTo(teamPlayersList, 'team:changed', this.onTeamChanged.bind(this));
		},
		onNameChanged: function() {
			var name = this.ui.name.val();
			console.log(name);
			if (name.length > 1) { //TODO validation
				this.teamName = name;
			} else {
				this.teamName = '';
			}
			this.checkIfSaveAllowed();
		},
		onTeamChanged: function(checked, model) {
			var playerId = model.get('playerId'),
				seasonId = model.get('seasonId'),
				balance;

			if (!checked) {
				var forRemove = this.team.findWhere({playerId: playerId, seasonId: seasonId});
				this.team.remove(forRemove);
			} else {
				this.team.add(model);
			}
			balance = this.team.reduce(function(sum, model) { 
				return sum + model.get('cost') 
			}, 0);
			this.ui.balance.text(balance);
			console.log(this.team.toJSON());
		},
		checkIfSaveAllowed: function() {
			console.log(this.team.toJSON());
			if (this.team.length > 0 && this.teamName) {
				this.ui.save.attr('disabled', false);
				return true;
			} else {
				this.ui.save.attr('disabled', true);
				return false;
			}
		},
		onSave: function() {
			if(this.checkIfSaveAllowed()) {
				this.trigger('team:save', this.teamName);
			} else {
				//todo prevent hack attr/ error msg???
			}
		}
	});
	return TeamCreationView;
});