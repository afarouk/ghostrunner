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
		onChildviewSelectionChanged: function(view, e) {
			var checked = $(e.currentTarget).is(':checked'),
				model = view.model;

			this.trigger('team:changed', checked, model);
		},
		onChildviewPositionChanged: function(view, e) {
			var $target = $(e.currentTarget),
				model = view.model,
				selected = $target.find(':selected').val(),
				position = _.findWhere(this.options.positions, {enumText: selected});
			model.set('position', position);
			// this.trigger('player:changed', position, model);
		}
	});
	return TeamPlayersListView;
});