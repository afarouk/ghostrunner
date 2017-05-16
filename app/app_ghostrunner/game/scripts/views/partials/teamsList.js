/*global define */

'use strict';

define([
	'ejs!../../templates/partials/team.ejs'
	], function(template){
	var TeamView = Mn.View.extend({
		tagName: 'li',
		className: 'team',
		template: template,
		triggers: {
			'click': 'team:selected'
		},
		initialize: function() {
			
		}
	});

	var TeamsListView = Mn.CollectionView.extend({
		className: 'teams-list',
		tagName: 'ul',
		initialize: function (options) {
		},
		childView: TeamView,
		onChildviewTeamSelected: function(view) {
			this.children.each(function(childView) {
				if (childView === view) {
					childView.$el.addClass('selected');
				} else {
					childView.$el.removeClass('selected');
				}
			}.bind(this));
			this.trigger('team:selected', view.model);
		}
	});
	return TeamsListView;
});