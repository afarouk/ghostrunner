/*global define */

'use strict';

define([
	'ejs!../../templates/partials/team.ejs',
	'ejs!../../templates/partials/newTeam.ejs',
	], function(teamTemplate, newTeamTemplate){
	var TeamView = Mn.View.extend({
		tagName: 'li',
		className: 'team',
		template: teamTemplate,
		ui: {
			lineup: '.lineup',
			removeTeam: '[name="remove-team"]',
			editTeam: '[name="edit-team"]',
			removeLineUp: '[name="remove-lineUp"]',
			editLineUp: '[name="edit-lineUp"]'
		},
		events: {
			'click @ui.lineup': 'onLineupSelected'
		},
		triggers: {
			'click': 'team:selected',
			'click @ui.removeTeam': 'team:remove',
			'click @ui.editTeam': 'team:edit',
			'click @ui.removeLineUp': 'lineUp:remove',
			'click @ui.editLineUp': 'lineUp:edit'
		},
		onLineupSelected: function(e) {
			var $target = $(e.currentTarget),
				lineUpId = $target.data('id');
			this.ui.lineup.removeClass('selected');
			$target.addClass('selected');
			this.trigger('lineup:selected', lineUpId);
			e.stopPropagation();
		},
		onRemoveLineUpSelection: function() {
			this.ui.lineup.removeClass('selected');
		}
	});

	var NewTeamView = Mn.View.extend({
		tagName: 'li',
		className: 'team new-team',
		template: newTeamTemplate,
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
		childView: function(model) {
			if (model.get('newTeam')) {
				return NewTeamView;
			} else {
				return TeamView;
			}
		},
		onChildviewTeamSelected: function(view) {
			this.children.each(function(childView) {
				if (childView === view) {
					childView.$el.addClass('selected');
				} else {
					childView.$el.removeClass('selected');
				}
				childView.triggerMethod('removeLineUpSelection');
			}.bind(this));
			this.trigger('team:selected', view.model);
		},
		onChildviewLineupSelected: function(lineUpId) {
			this.trigger('lineUp:selected', lineUpId);
		},
		onChildviewTeamRemove: function(view, e) {
			// e.preventDefault();
			if (this.allowChanges(view)) {
				this.trigger('team:remove', view.model);
			}
		},
		onChildviewTeamEdit: function(view, e) {
			// e.preventDefault();
			if (this.allowChanges(view)) {
				this.trigger('team:edit', view.model);
			}
		},
		onChildviewLineUpRemove: function(view, e) {
			// e.preventDefault();
			var $target = $(e.currentTarget),
				lineUpId = $target.parent().parent().data('id'),
				lineUp = _.findWhere(view.model.get('lineUps'), {lineUpId: lineUpId});
			if (this.allowChanges(view)) {
				this.trigger('lineUp:remove', lineUp);
			}
		},
		onChildviewLineUpEdit: function(view, e) {
			// e.preventDefault();
			var $target = $(e.currentTarget),
				lineUpId = $target.parent().parent().data('id'),
				lineUp = _.findWhere(view.model.get('lineUps'), {lineUpId: lineUpId});
			if (this.allowChanges(view)) {
				this.trigger('lineUp:edit', lineUp);
			}
		},
		allowChanges: function(view) {
			var allow = view.model.get('type').enumText ===  'PRIVATE' ? true : false;
			return allow;
		}
	});
	return TeamsListView;
});