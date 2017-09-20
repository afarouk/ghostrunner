/*global define */

'use strict';

define([
	'ejs!../../templates/partials/lineUpCreation.ejs',
	'./lineUpPlayersList'
	], function(template, LineUpPlayersList){
	var LineUpCreationView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-lineUp',
		regions: {
			players: '.players-list-container'
		},
		ui: {
			name: '[name="lineUp-name"]',
			count: '[name="count"]',
			save: '[name="save"]',
			cancel: '[name="cancel"]'
		},
		events: {
			'click @ui.save': 'onSave'
		},
		triggers: {
			'click @ui.cancel': 'cancel'
		},
		lineUpName: '',
		minPlayers: 8, //change min players count here
		maxPlayers: 8,
		initialize: function(options) {
			this.lineUp = options.lineUp;
			this.lineUp.on('change add remove', this.checkIfSaveAllowed, this);
		},
		serializeData: function() {
			this.lineUpName = this.options.lineUpName;
			return {
				teamName: this.options.teamName,
				lineUpName: this.options.lineUpName
			};
		},
		onRender: function() {
            var name = this.ui.name.val();
            this.lineUpName = name;
			this.lineUpPlayersList = new LineUpPlayersList({
				collection: this.options.players,
				lineUp: this.lineUp,
				headings: this.options.headings
			});
			this.showChildView('players', this.lineUpPlayersList);
			this.listenTo(this.lineUpPlayersList, 'lineUp:changed', this.onLineUpChanged.bind(this));
		},
		onLineUpChanged: function(checked, model) {
			var playerId = model.get('playerId'),
				seasonId = model.get('seasonId'),
				leagueId = model.get('leagueId'),
				playerRoleId=model.get('playerRoleId');

			if (!checked) {
				var forRemove = this.lineUp.findWhere({playerId: playerId, seasonId: seasonId, leagueId:leagueId , playerRoleId:playerRoleId});
				this.lineUp.remove(forRemove);
			} else {
				this.lineUp.add(model);
			}
			this.ui.count.text(this.lineUp.length);
		},
		showCountWarning: function() {
			this.publicController.getChoiceController().showConfirmation({
                message: 'Count should be less than ' + (this.maxPlayers + 1) + '.',
                confirm: 'ok'
            });
		},
		checkCount: function() {
			var count  = this.lineUp.length;
			this.ui.count.text(count);
			if (count > this.maxPlayers) {
				this.ui.count.css('color', 'red');
				this.lineUpPlayersList.triggerMethod('players:selection:allow', false);
				this.showCountWarning();
				return false;
			} else if (count < this.minPlayers) {
				return false;
			} else {
				this.ui.count.css('color', '#71ff61');
				this.lineUpPlayersList.triggerMethod('players:selection:allow', true);
				return true;
			}
		},
		checkIfSaveAllowed: function() {
			console.log(this.lineUp.toJSON());
			if (this.checkCount() && this.lineUp.length > 0 && this.lineUpName) {
				this.ui.save.attr('disabled', false);
				return true;
			} else {
				this.ui.save.attr('disabled', true);
				return false;
			}
		},
		onSave: function() {
			if(this.checkIfSaveAllowed()) {
				this.trigger('lineUp:save', this.lineUpName);
			} else {
				//todo prevent hack attr/ error msg???
			}
		}
	});
	return LineUpCreationView;
});
