/*global define */

'use strict';

define([
	'ejs!../../templates/partials/lineUpTable.ejs',
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
		}
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