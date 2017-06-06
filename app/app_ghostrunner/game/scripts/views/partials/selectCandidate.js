/*global define */

'use strict';

define([
	'ejs!../../templates/partials/selectCandidate.ejs',
	'./selectCandidateList'
	], function(template, SelectCandidateList){
	var SelectCandidateView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-lineUp',
		regions: {
			players: '.players-list-container table'
		},
		ui: {
			name: '[name="lineUp-name"]',
			save: '[name="save"]'
		},
		events: {
			'change @ui.name': 'onNameChanged',
			'keyup @ui.name': 'onNameChanged',
			'click @ui.save': 'onSave'
		},
		lineUpName: '',
		serializeData: function() {
			return {
				teamName: this.options.teamName
			};
		},
		onRender: function() {
			console.log('lineUp creation');
			this.playersList = new SelectCandidateList({
				collection: this.options.players
			});
			this.showChildView('players', this.playersList);
			this.listenTo(this.playersList, 'player:selected', this.onPlayerSelected.bind(this));
		},
		onNameChanged: function() {
			var name = this.ui.name.val();
			console.log(name);
			if (name.length > 1) { //TODO validation
				this.lineUpName = name;
			} else {
				this.lineUpName = '';
			}
			this.checkIfSaveAllowed();
		},
		onPlayerSelected: function(model) {
			this.selectedPlayer = model;
			this.checkIfSaveAllowed();
		},
		checkIfSaveAllowed: function() {
			if (this.selectedPlayer && this.lineUpName) {
				this.ui.save.attr('disabled', false);
				return true;
			} else {
				this.ui.save.attr('disabled', true);
				return false;
			}
		},
		onSave: function() {
			if(this.checkIfSaveAllowed()) {
				this.trigger('lineUp:save', this.lineUpName, this.selectedPlayer);
			} else {
				//todo prevent hack attr/ error msg???
			}
		}
	});
	return SelectCandidateView;
});