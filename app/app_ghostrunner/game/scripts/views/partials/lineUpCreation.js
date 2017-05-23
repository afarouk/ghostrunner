/*global define */

'use strict';

define([
	'../../Vent',
	'ejs!../../templates/partials/lineUpCreation.ejs',
	'./lineUpPlayersList'
	], function(Vent, template, LineUpPlayersList){
	var LineUpCreationView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-lineUp',
		regions: {
			players: '.players-list-container table'
		},
		ui: {
			name: '[name="lineUp-name"]',
			count: '[name="count"]',
			save: '[name="save"]'
		},
		events: {
			'change @ui.name': 'onNameChanged',
			'keyup @ui.name': 'onNameChanged',
			'click @ui.save': 'onSave'
		},
		lineUpName: '',
		initialize: function(options) {
			this.lineUp = options.lineUp;
			this.lineUp.on('change add remove', this.checkIfSaveAllowed, this);
		},
		serializeData: function() {
			return {
				teamName: this.options.teamName
			};
		},
		onRender: function() {
			console.log('lineUp creation');
			var lineUpPlayersList = new LineUpPlayersList({
				collection: this.options.players,
				positions: this.options.positions
			});
			this.showChildView('players', lineUpPlayersList);
			this.listenTo(lineUpPlayersList, 'lineUp:changed', this.onLineUpChanged.bind(this));
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
		onLineUpChanged: function(checked, model) {
			var playerId = model.get('playerId'),
				seasonId = model.get('seasonId');

			if (!checked) {
				var forRemove = this.lineUp.findWhere({playerId: playerId, seasonId: seasonId});
				this.lineUp.remove(forRemove);
			} else {
				this.lineUp.add(model);
			}
			this.ui.count.text(this.lineUp.length);
			console.log(this.lineUp.toJSON());
		},
		checkIfSaveAllowed: function() {
			console.log(this.lineUp.toJSON());
			if (this.lineUp.length > 0 && this.lineUpName) {
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