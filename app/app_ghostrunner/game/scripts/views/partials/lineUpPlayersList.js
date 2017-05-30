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
			var starterModel = this.options.lineUp.at(0),
				starter = this.model.get('playerId') === starterModel.get('playerId') &&
					this.model.get('seasonId') === starterModel.get('seasonId') ? true : false;
			if (starter) this.$el.addClass('starter-player');
			return _.extend(this.model.toJSON(), {
				starter: starter,
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
		onChildviewSelectionChanged: function(view, e) {
			var checked = $(e.currentTarget).is(':checked'),
				model = view.model;

			this.trigger('lineUp:changed', checked, model);
		},
		onChildviewPositionChanged: function(view, e) {
			var $target = $(e.currentTarget),
				model = view.model,
				selected = $target.find(':selected').val(),
				position = _.findWhere(this.options.positions, {enumText: selected});
			model.set('position', position);
		},
		onPlayersSelectionAllow: function(allow) {
			this.children.each(function(view) {
				var $checkbox = view.ui.select,
					isChecked = $checkbox.is(':checked');
				if (isChecked) {
					$checkbox.attr('disabled', false);
				} else {
					if (allow) {
						$checkbox.attr('disabled', false);
					} else {
						$checkbox.attr('disabled', true);
					}
				}
			});
		}
	});
	return LineUpPlayersListView;
});