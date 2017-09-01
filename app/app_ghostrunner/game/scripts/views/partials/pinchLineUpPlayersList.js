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
			select: '.select-player',
			position: '[name="player-position"]'
		},
		triggers: {
			'change @ui.select': 'selection:changed',
			'change @ui.position': 'position:changed'
		},
		serializeData: function() {
			var props = this.model.get('properties'),
				positions = this.model.get('positions'),
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

			//temporary tweak for fake data v
			if (!_.findWhere(positions, {enumText: this.model.get('position').enumText})) {
				positions.unshift(this.model.get('position'));
			}

            return _.extend(this.model.toJSON(), {
                flag: flag,
				properties: values,
				onePlayer: this.collection.length > 1 ? false : true,
				currentPosition: this.model.get('position'),
			});
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
		onChildviewSelectionChanged: function(view) {
			this.trigger('selection:changed', view.model);
		},
        onChildviewPositionChanged: function(view, e) {
                var $target = $(e.currentTarget),
                    model = view.model,
                    selected = $target.find(':selected').val(),
                    positions = model.get('positions'),
                    position = _.findWhere(positions, {enumText: selected});
                model.set('position', position);
                debugger;
                this.checkIfEnable(view, model);
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
		}
	});
	return LineUpPlayersListView;

});
