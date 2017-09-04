/*global define */

'use strict';

define([
	'ejs!../../templates/partials/myInvite.ejs'
	], function(template){
	var InviteView = Mn.View.extend({
		tagName: 'li',
		className: 'my-game',
		template: template,
		triggers: {
			'click': 'invitation:selected'
		},
	});

	var InvitesListView = Mn.CollectionView.extend({
		className: 'games-list',
		tagName: 'ul',
		childView: InviteView,
		onChildviewInvitationSelected: function(view) {
			if (!view.model.get('actionable')) return;
			this.children.each(function(childView) {
				if (childView === view) {
					childView.$el.addClass('selected');
				} else {
					childView.$el.removeClass('selected');
				}
			}.bind(this));
			this.trigger('invitation:selected', view.model);
		}
	});
	return InvitesListView;
});