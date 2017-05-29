/*global define */

'use strict';

define([
	'ejs!../../templates/partials/lineUpCandidate.ejs'
	], function(template){
	var LineUpCandidateView = Mn.View.extend({
		tagName: 'tr',
		className: 'lineUp-player',
		template: template,
		ui: {
			select: '[name="select-player"]'
		},
		triggers: {
			'change @ui.select': 'selection:changed'
		}
	});

	var LineUpCandidatesListView = Mn.CollectionView.extend({
		className: 'lineUp-players',
		tagName: 'tbody',
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