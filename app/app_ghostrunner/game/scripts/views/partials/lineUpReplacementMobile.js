/*global define */

'use strict';

define([
	'ejs!../../templates/partials/lineUpReplacementMobile.ejs',
	'./replacementLineUpPlayersListMobile'
	], function(template, LineUpPlayersList){
	var LineUpReplacementView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-lineUp',
		regions: {
			players: '.players-list-container',
            availablePlayers: '.players-list-availablePlayers'
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

            this.availablePlayers = new LineUpPlayersList({
				collection: this.options.availablePlayers,
				headings: this.options.headings,
                flag: false
			});

			this.listenTo(this.lineUpPlayersList, 'selection:changed', this.onSelectionChanged.bind(this, 'old'));
			this.listenTo(this.availablePlayers, 'selection:changed', this.onSelectionChanged.bind(this, 'new'));
			this.showChildView('players', this.lineUpPlayersList);
            this.showChildView('availablePlayers', this.availablePlayers);
		},
		onSelectionChanged: function(whichList, model) {
			if (whichList === 'old') {
				this.oldPlayer = model;
			} else {
				this.newPlayer = model;
			}
			if (this.oldPlayer && this.newPlayer) {
				this.ui.save.removeClass('disabled');
			} else {
				this.ui.save.addClass('disabled');
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

	return LineUpReplacementView;
});
