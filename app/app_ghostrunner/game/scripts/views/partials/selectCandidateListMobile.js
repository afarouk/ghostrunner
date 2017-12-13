/*global define */

'use strict';

define([
	'ejs!../../templates/partials/lineUpCandidateMobile.ejs'
	], function(childTmpl){
	var LineUpCandidateView = Mn.View.extend({
		tagName: 'li',
		className: 'lineUp-player',
		template: childTmpl,
		ui: {
			select: '[name="select-player"]',
			expand: '.toggle-expand'
		},
		triggers: {
			'change @ui.select': 'selection:changed'
		},
		events: {
			'click @ui.expand': 'onPlayerExpand'
		},
		serializeData: function() {
			var props = this.model.get('properties'),
				headings = this.options.headings.slice(2),
				quality = _.findWhere(props, {index: 1}),
				values = [];
			values = _.map(headings, function(heading){
				var index = heading.index;
				if (index < 2) {
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
			return {
				playerName:  this.model.get('displayText'),
				quality: quality ? quality.displayValue : '',
				properties:values,
				headings: headings
			};
		},

		onPlayerExpand: function () {
			this.$el.toggleClass('expanded');
		}
	});

	var LineUpCandidatesListView = Mn.CollectionView.extend({
		className: 'lineUp-players',
		tagName: 'ul',
		childView: LineUpCandidateView,
		childViewOptions: function() {
			return this.options;
		},
		onChildviewSelectionChanged: function(view) {
			var model = view.model;

			this.trigger('player:selected', model);
		}
	});
	return LineUpCandidatesListView;
});