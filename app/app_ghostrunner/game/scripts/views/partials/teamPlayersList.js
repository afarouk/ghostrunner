/*global define */

'use strict';

define([
	'ejs!../../templates/partials/teamPlayer.ejs'
	], function(template){
	var TeamPlayerView = Mn.View.extend({
		tagName: 'tr',
		className: 'team-player',
		template: template,
		ui: {
			select: '[name="select-player"]',
			position: '[name="player-position"]'
		},
		triggers: {
			'change @ui.select': 'selection:changed',
			'change @ui.position': 'position:changed'
		},
		serializeData: function() {
			return _.extend(this.model.toJSON(), {
				positions: this.options.positions
			});
		}
	});

	var TeamPlayersListView = Mn.CollectionView.extend({
		className: 'team-players',
		tagName: 'tbody',
		childView: TeamPlayerView,
		childViewOptions: function() {
			return this.options;
		},
		onChildviewSelectionChanged: function(view) {
			debugger;
			this.children.each(function(childView) {
				
			}.bind(this));
		},
		onChildviewPositionChanged: function(view) {
			debugger;
			this.children.each(function(childView) {
				
			}.bind(this));
		}
	});
	return TeamPlayersListView;
});