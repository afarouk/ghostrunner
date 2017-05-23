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
		},
		triggers: {
			'change @ui.select': 'selection:changed',
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
	return TeamPlayersListView;
});