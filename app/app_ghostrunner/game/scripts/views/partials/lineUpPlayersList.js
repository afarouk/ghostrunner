/*global define */

'use strict';

define([
	'ejs!../../templates/partials/lineUpPlayer.ejs'
	], function(template){
	var LineUpPlayerView = Mn.View.extend({
		tagName: 'tr',
		className: 'lineUp-player',
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

	var LineUpPlayersListView = Mn.CollectionView.extend({
		className: 'lineUp-players',
		tagName: 'tbody',
		childView: LineUpPlayerView,
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
	return LineUpPlayersListView;
});