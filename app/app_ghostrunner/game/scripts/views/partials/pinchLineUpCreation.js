/*global define */

'use strict';

define([
	'ejs!../../templates/partials/pinchLineUpCreation.ejs',
	'./pinchLineUpPlayersList'
	], function(template, LineUpPlayersList){
	var LineUpCreationView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-lineUp',
		regions: {
			players: '.players-list-container',
            availableplayers: '.players-list-Availableplayers'
		},
		ui: {
			save: '[name="save"]'
		},
		events: {
			'click @ui.save': 'onSave'
		},
		initialize: function(options) {
		},
		serializeData: function() {
			return {
				title: this.options.title
			};
		},
		onRender: function() {
			// this.options.players = new Backbone.Collection(this.options.players.at(0)); //for testing
			this.lineUpPlayersList = new LineUpPlayersList({
				collection: this.options.players,
				headings: this.options.headings,
                flag: true
			});
			if (this.options.players.length === 1) {
				this.oldPlayer = this.options.players.at(0);
			}

            this.availableplayers = new LineUpPlayersList({
				collection: this.options.availableplayers,
				headings: this.options.headings,
                flag: false
			});

			this.listenTo(this.lineUpPlayersList, 'selection:changed', this.onSelectionChanged.bind(this, 'old'));
			this.listenTo(this.availableplayers, 'selection:changed', this.onSelectionChanged.bind(this, 'new'));
			this.showChildView('players', this.lineUpPlayersList);
            this.showChildView('availableplayers', this.availableplayers);
		},
		onSelectionChanged: function(whichList, model) {
			if (whichList === 'old') {
				this.oldPlayer = model;
			} else {
				this.newPlayer = model;
			}
			if (this.oldPlayer && this.newPlayer) {
				this.ui.save.attr('disabled', false);
			} else {
				this.ui.save.attr('disabled', true);
			}
		},
		onSave: function() {
            var playersParams = {
				oldPlayer : {
				    playerId: this.oldPlayer.get('playerId'),
				    seasonId: this.oldPlayer.get('seasonId'),
				    leagueId: this.oldPlayer.get('leagueId'),
				    playerRoleId: this.oldPlayer.get('playerRoleId')
				},
				newPlayer : {
				    playerId: this.newPlayer.get('playerId'),
				    seasonId: this.newPlayer.get('seasonId'),
				    leagueId: this.newPlayer.get('leagueId'),
				    playerRoleId: this.newPlayer.get('playerRoleId')
				},
				newPosition : this.newPlayer.get('position').enumText,
  				newBattingOrder : null
            };

            this.trigger('lineUp:save', playersParams);
    	}
    });

	return LineUpCreationView;
});
