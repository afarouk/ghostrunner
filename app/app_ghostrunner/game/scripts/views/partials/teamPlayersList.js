/*global define */

'use strict';

define([
	'ejs!../../templates/partials/teamFielder.ejs',
	'ejs!../../templates/partials/teamPitcher.ejs'
	], function(fielderTmpl, pitcherTmpl){
	//FILDER
	var TeamPlayerFielderView = Mn.View.extend({
		tagName: 'tr',
		className: 'team-player',
		template: fielderTmpl,
		ui: {
			select: '[name="select-player"]',
		},
		triggers: {
			'change @ui.select': 'selection:changed',
		},
		// serializeData: function() {
		// 	return _.extend(this.model.toJSON(), {
		// 		positions: this.options.positions
		// 	});
		// }
	});
	//PITCHER
	var TeamPlayerPitcherView = Mn.View.extend({
		tagName: 'tr',
		className: 'team-player pitcher',
		template: pitcherTmpl,
		ui: {
			select: '[name="select-player"]',
		},
		triggers: {
			'change @ui.select': 'selection:changed',
		},
		// serializeData: function() {
		// 	return _.extend(this.model.toJSON(), {
		// 		positions: this.options.positions
		// 	});
		// }
	});
	//PLAYERS LIST
	var TeamPlayersListView = Mn.CollectionView.extend({
		className: 'team-players',
		tagName: 'tbody',
		childView: function(model) {
			var type = model.get('type').enumText;
			if (type === 'FIELDER') {
				return TeamPlayerFielderView;
			} else {
				return TeamPlayerPitcherView;
			}
		},
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