/*global define */

'use strict';

define([
	'ejs!../../templates/partials/lineUpFielder.ejs',
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
		},
		onEnableBOSelector: function(enable) {
			if (enable) {
				this.ui.bo.attr('disabled', false);
			} else {
				this.ui.bo
					.attr('disabled', true)
					.find('option:eq(0)').prop('selected', true).change();
				// this.ui.bo.change();
			}
		}
	});

	var LineUpPlayersListView = Mn.CompositeView.extend({
		template: tableTmpl,
		className: 'lineUp-players without-checkbox',
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
				currentPosition = model.get('position').enumText ? model.get('position') : null,
				position = _.findWhere(positions, {enumText: selected});

			if (position) {
				model.set('position', position);
				view.triggerMethod('enableBOSelector', true);
			} else {
				model.set('position', {
					displayText: 'UU',
					enumText: 'UNDEFINED',
					id: 0
				});
				view.triggerMethod('enableBOSelector', false);
			}
			this.checkIfEnable(view, model);
			this.children.each(function(childView) {
				if (childView !== view) {
					if (currentPosition) {
						var option = childView.ui.position.find('option[value="' + currentPosition.enumText + '"]');
						option.attr('disabled', false);
					}
					if (position) {
						var option = childView.ui.position.find('option[value="' + position.enumText + '"]');
						option.attr('disabled', true);
					}

				}
			}.bind(this));
		},
		onChildviewBattingOrderChanged: function(view, e) {
			var $target = $(e.currentTarget),
				model = view.model,
				currentOrder = model.get('battingOrder'),
				selected = $target.find(':selected').val();

			if (selected) {
				model.set('battingOrder', selected);
			} else if (currentOrder) {
				model.set('battingOrder', 0);
			}
			this.checkIfEnable(view);
			this.children.each(function(childView) {
				if (childView !== view) {
					if (currentOrder) {
						var option = childView.ui.bo.find('option[value="' + currentOrder + '"]');
						option.attr('disabled', false);
					}
					if (selected) {
						var option = childView.ui.bo.find('option[value="' + selected + '"]');
						option.attr('disabled', true);
					}

				}
			}.bind(this));
		},
		checkIfEnable: function(view) {
			var model = view.model;
			if (model.get('position').enumText !== 'UNDEFINED' && model.get('battingOrder')) {
				view.ui.select.attr('disabled', false);
				view.ui.select.prop('checked', true).change();
			} else {
				view.ui.select.prop('checked', false).change();
				view.ui.select.attr('disabled', true);
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
});