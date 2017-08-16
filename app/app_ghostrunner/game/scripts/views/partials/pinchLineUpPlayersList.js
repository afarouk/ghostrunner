/*global define */

'use strict';

define([
	'ejs!../../templates/partials/pinchLineUpFielder.ejs',
	'ejs!../../templates/partials/pinchLineUpTable.ejs',
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
                flag = this.options.flag,
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
			
            return  {
                flag: flag,
				properties: values,
				positions: this.model.get('positions'),
				playerRoleId : this.model.get('playerRoleId'),
			    leagueId : this.model.get('leagueId'),
                seasonId : this.model.get('seasonId'),
                playerId : this.model.get('playerId'),
                position : this.model.get('position')
			};
		}
	});

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
				headings: this.options.headings,
                flag:this.options.flag
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
