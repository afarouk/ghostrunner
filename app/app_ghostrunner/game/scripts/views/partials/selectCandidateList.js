/*global define */

'use strict';

define([
	'ejs!../../templates/partials/starterTable.ejs',
	'ejs!../../templates/partials/lineUpCandidate.ejs'
	], function(tableTmpl, childTmpl){
	var LineUpCandidateView = Mn.View.extend({
		tagName: 'tr',
		className: 'lineUp-player',
		template: childTmpl,
		ui: {
			select: '[name="select-player"]'
		},
		triggers: {
			'change @ui.select': 'selection:changed'
		},
		serializeData: function() {
			var props = this.model.get('properties'),
				headings = this.options.headings,
				values = [];
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
			return {properties:values};
		},
	});

	var LineUpCandidatesListView = Mn.CompositeView.extend({
		template: tableTmpl,
		className: 'lineUp-players',
		// tagName: 'tbody',
		childView: LineUpCandidateView,
		childViewContainer: "tbody",
		childViewOptions: function() {
			return this.options;
		},
		serializeData: function() {
			return {
				headings: this.options.headings
			};
		},
		onChildviewSelectionChanged: function(view) {
			var model = view.model;

			this.trigger('player:selected', model);
		}
	});
	return LineUpCandidatesListView;
});