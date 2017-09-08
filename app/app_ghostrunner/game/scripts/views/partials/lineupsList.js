/*global define */

'use strict';

define([
	'ejs!../../templates/partials/myLineup.ejs',
	], function(lineupTemplate){
	var LineupView = Mn.View.extend({
		tagName: 'li',
		className: 'team',
		template: lineupTemplate,
		ui: {
			lineup: '.lineup',
			removeLineup: '[name="remove-team"]',
		},
		triggers: {
			'click': 'lineup:selected',
			'click @ui.removeLineup': 'lineup:remove',
		}
	});

	var LineupsListView = Mn.CollectionView.extend({
		className: 'teams-list',
		tagName: 'ul',
		initialize: function (options) {

		},
		childView: LineupView,
		onChildviewLineupSelected: function(view) {
			if (this.options.state !== 'my_lineups') {
				this.children.each(function(childView) {
					if (childView === view) {
						childView.$el.addClass('selected');
					} else {
						childView.$el.removeClass('selected');
					}
				}.bind(this));
				this.trigger('lineup:selected', view.model);
			}
		}
	});
	return LineupsListView;
});