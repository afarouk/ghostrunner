/*global define */

'use strict';

define([
	'ejs!../../templates/partials/teamCreation.ejs',
	'./teamPlayersList'
	], function(template, TeamPlayersList){
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
			save: '[name="save"]',
			cancel: '[name="cancel"]'
		},
		events: {
			'change @ui.name': 'onNameChanged',
			'keyup @ui.name': 'onNameChanged',
			'click @ui.save': 'onSave'
		},
		triggers: {
			'click @ui.cancel': 'cancel'
		},
		teamName: '',
		initialize: function(options) {
			this.team = options.team;
			this.team.on('change add remove', this.checkIfSaveAllowed, this);
		},
		serializeData: function() {
			return  {
				teamName: this.options.editedTeam ? this.options.editedTeam.get('displayText') : ''
			};
		},
		onRender: function() {
			console.log('team creation');
			this.teamPlayersList = new TeamPlayersList({
				collection: this.options.players,
				positions: this.options.positions
			});
			this.showChildView('players', this.teamPlayersList);
			this.listenTo(this.teamPlayersList, 'team:changed', this.onTeamChanged.bind(this));

			this.focusInput();
		},
		focusInput: function() {
			setTimeout(function(){
				this.ui.name.focus();
			}.bind(this), 1);
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
				seasonId = model.get('seasonId');

			if (!checked) {
				var forRemove = this.team.findWhere({playerId: playerId, seasonId: seasonId});
				this.team.remove(forRemove);
			} else {
				this.team.add(model);
			}
			console.log(this.team.toJSON());
		},
		showCostWarning: function() {
			this.publicController.getChoiceController().showConfirmation({
                message: 'Cost should be less or equal 100.',
                confirm: 'ok'
            });
		},
		checkBallance: function() {
			var balance = this.team.reduce(function(sum, model) {
				if (model.get('type').enumText === 'PITCHER')  {
					return sum;
				} else {
					return sum + model.get('cost');
				}
			}, 0);

			this.ui.balance.text('[' + balance + ']');
			if (balance > 100) {
				this.ui.balance.css('color', 'red');
				this.teamPlayersList.triggerMethod('players:selection:allow', false);
				this.showCostWarning();
				return false;
			} else {
				this.ui.balance.css('color', '#71ff61');
				this.teamPlayersList.triggerMethod('players:selection:allow', true);
				return true;
			}
		},
		checkIfSaveAllowed: function() {
			console.log(this.team.toJSON());
			if (this.checkBallance() && this.team.length > 0 && this.teamName) {
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