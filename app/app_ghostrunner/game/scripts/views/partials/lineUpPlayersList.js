/*global define */

'use strict';

define([
	'ejs!../../templates/partials/lineUpFielder.ejs',
	// 'ejs!../../templates/partials/lineUpPitcher.ejs',
	'ejs!../../templates/partials/lineUpTable.ejs',
	], function(fielderTmpl, tableTmpl){
	var LineUpFielderView = Mn.View.extend({
		tagName: 'tr',
		className: 'lineUp-player',
		template: fielderTmpl,
		ui: {
			select: '[name="select-player"]',
			position: '[name="player-position"]',
			bo: '[name="batting-order"]'
		},
		triggers: {
			'change @ui.select': 'selection:changed',
			'change @ui.position': 'position:changed',
			'change @ui.bo': 'battingOrder:changed'
		},
		serializeData: function() {
			var props = this.model.get('properties'),
				headings = this.options.headings,
				values;
			values = _.map(headings, function(heading){
				var index = heading.index;
				if (index === 0) {
					return {
						displayValue: this.model.get('displayText'),
						className: ''
					};
				} else {
					var prop = _.findWhere(props, {index:index});
					if (prop) {
						return {
							displayValue: prop.displayValue,
							className: 'with-bg'
						};
					} else {
						return undefined;
					}
				}
			}.bind(this));
			return {
				properties:values,
				positions: this.model.get('positions')
			};
		}
	});

	// var LineUpPitcherView = Mn.View.extend({
	// 	tagName: 'tr',
	// 	className: 'lineUp-player pitcher',
	// 	template: pitherTmpl,
	// 	ui: {
	// 		select: '[name="select-player"]',
	// 		rp: '[name="pitcher-role"]'
	// 	},
	// 	triggers: {
	// 		'change @ui.select': 'selection:changed',
	// 		'change @ui.rp': 'pitcherRole:changed'
	// 	},
	// 	serializeData: function() {
	// 		var starterModel = this.options.lineUp.at(0),
	// 			starter = this.model.get('playerId') === starterModel.get('playerId') &&
	// 				this.model.get('seasonId') === starterModel.get('seasonId') ? true : false;
	// 		if (starter) this.$el.addClass('starter-player');
	// 		return _.extend(this.model.toJSON(), {
	// 			starter: starter,
	// 			// positions: this.options.positions
	// 		});
	// 	}
	// });

	var LineUpPlayersListView = Mn.CompositeView.extend({
		template: tableTmpl,
		className: 'lineUp-players',
		// tagName: 'tbody',
		childView: LineUpFielderView,
		childViewContainer: "tbody",
		childViewOptions: function() {
			return this.options;
		},
		serializeData: function() {
			return {
				headings: this.options.headings
			};
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
				positions = model.get('positions'),
				position = _.findWhere(positions, {enumText: selected});
			model.set('position', position);
			this.checkIfEnable(view, model);
		},
		onChildviewBattingOrderChanged: function(view, e) {
			var $target = $(e.currentTarget),
				model = view.model,
				selected = $target.find(':selected').val();
			model.set('battingOrder', selected);
			this.checkIfEnable(view);
		},
		checkIfEnable: function(view) {
			var model = view.model;
			if (model.get('position').enumText !== 'UNDEFINED' && model.get('battingOrder')) {
				view.ui.select.attr('disabled', false);
			}
		},
		onChildviewPitcherRoleChanged: function(view, e) {
			var $target = $(e.currentTarget),
				model = view.model,
				selected = $target.find(':selected').val(),
				roles = model.get('pitcherRoles'),
				role = _.findWhere(roles, {enumText: selected});
			model.set('pitcherRole', role);
		},
		onPlayersSelectionAllow: function(allow) {
			this.children.each(function(view) {
				var $checkbox = view.ui.select,
					isChecked = $checkbox.is(':checked');
				if (isChecked) {
					$checkbox.attr('disabled', false);
				} else {
					if (allow) {
						this.checkIfEnable(view);
					} else {
						$checkbox.attr('disabled', true);
					}
				}
			}.bind(this));
		}
	});
	return LineUpPlayersListView;

	// var LineUpPlayersListView = Mn.CollectionView.extend({
	// 	className: 'lineUp-players',
	// 	tagName: 'tbody',
	// 	childView: function(model) {
	// 		var type = model.get('type').enumText;
	// 		if (type === 'FIELDER') {
	// 			return LineUpFielderView;
	// 		} else {
	// 			return LineUpPitcherView;
	// 		}
	// 	},
	// 	childViewOptions: function() {
	// 		return this.options;
	// 	},
	// 	onChildviewSelectionChanged: function(view, e) {
	// 		var checked = $(e.currentTarget).is(':checked'),
	// 			model = view.model;

	// 		this.trigger('lineUp:changed', checked, model);
	// 	},
	// 	onChildviewPositionChanged: function(view, e) {
	// 		var $target = $(e.currentTarget),
	// 			model = view.model,
	// 			selected = $target.find(':selected').val(),
	// 			positions = model.get('positions'),
	// 			position = _.findWhere(positions, {enumText: selected});
	// 		model.set('position', position);
	// 	},
	// 	onChildviewBattingOrderChanged: function(view, e) {
	// 		var $target = $(e.currentTarget),
	// 			model = view.model,
	// 			selected = $target.find(':selected').val();
	// 		model.set('battingOrder', selected);
	// 	},
	// 	onChildviewPitcherRoleChanged: function(view, e) {
	// 		var $target = $(e.currentTarget),
	// 			model = view.model,
	// 			selected = $target.find(':selected').val(),
	// 			roles = model.get('pitcherRoles'),
	// 			role = _.findWhere(roles, {enumText: selected});
	// 		model.set('pitcherRole', role);
	// 	},
	// 	onPlayersSelectionAllow: function(allow) {
	// 		this.children.each(function(view) {
	// 			var $checkbox = view.ui.select,
	// 				isChecked = $checkbox.is(':checked');
	// 			if (isChecked) {
	// 				$checkbox.attr('disabled', false);
	// 			} else {
	// 				if (allow) {
	// 					$checkbox.attr('disabled', false);
	// 				} else {
	// 					$checkbox.attr('disabled', true);
	// 				}
	// 			}
	// 		});
	// 	}
	// });
});