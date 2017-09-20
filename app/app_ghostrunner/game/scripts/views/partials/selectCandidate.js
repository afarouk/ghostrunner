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
			players: '.players-list-container'
		},
		ui: {
			name: '[name="lineUp-name"]',
			save: '[name="save"]',
			cancel: '[name="cancel"]',
			listContainer: '[name="list-container"]'
		},
		events: {
			'click @ui.save': 'onSave'
		},
		triggers: {
			'click @ui.cancel': 'cancel'
		},
		lineUpName: '',
		serializeData: function() {
			return {
				teamName: this.options.teamName
			};
		},
		onRender: function() {
			console.log('lineUp creation');
            this.ui.listContainer.removeClass('masked');
			this.playersList = new SelectCandidateList({
				collection: this.options.players,
				headings: this.options.headings
			});
			this.showChildView('players', this.playersList);
			this.listenTo(this.playersList, 'player:selected', this.onPlayerSelected.bind(this));
		},
	
		onPlayerSelected: function(model) {
			this.selectedPlayer = model;
			this.checkIfSaveAllowed();
		},
		checkIfSaveAllowed: function() {
			if (this.selectedPlayer) {
				this.ui.save.attr('disabled', false);
				return true;
			} else {
				this.ui.save.attr('disabled', true);
				return false;
			}
		},
		onSave: function() {
			if(this.checkIfSaveAllowed()) {
				this.trigger('lineUp:save', this.selectedPlayer);
			} else {
				//todo prevent hack attr/ error msg???
			}
		}
	});
	return SelectCandidateView;
});