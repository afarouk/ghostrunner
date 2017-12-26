/*global define */

'use strict';

define([
	'ejs!../../templates/partials/replacementLineUpFielderMobile.ejs'
	], function(template){
	var LineUpFielderView = Mn.View.extend({
		tagName: 'li',
		className: 'lineUp-player',
		template: template,
		ui: {
			select: '.select-player',
			position: '[name="player-position"]',
			expand: '.toggle-expand'
		},
		triggers: {
			'change @ui.select': 'selection:changed',
			'change @ui.position': 'position:changed'
		},
		events: {
			'click @ui.expand': 'onPlayerExpand'
		},
		serializeData: function() {
			var props = this.model.get('properties'),
				positions = this.model.get('positions'),
				headings = this.options.headings.slice(1),
                flag = this.options.flag,
				values;
			values = _.map(headings, function(heading){
				var index = heading.index;
				if (index < 1) {
					return null;
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
				positions: this.model.get('positions'),
				playerName:  this.model.get('displayText'),
				headings: headings
			});
		},
		onPlayerExpand: function () {
			this.$el.toggleClass('expanded');
		},
	});

	var LineUpPlayersListView = Mn.CollectionView.extend({
		className: 'lineUp-players',
		tagName: 'ul',
		childView: LineUpFielderView,
		childViewOptions: function() {
			return this.options;
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
            this.checkIfEnable(view, model);
        },
		checkIfEnable: function(view) {
			var model = view.model;

			if (model.get('position').enumText !== 'UNDEFINED') {
				view.ui.select.attr('disabled', false);
			} else {
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
