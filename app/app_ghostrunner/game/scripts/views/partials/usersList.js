/*global define */

'use strict';

define([
	'ejs!../../templates/partials/availableUser.ejs'
	], function(template){
	var UserView = Mn.View.extend({
		tagName: 'li',
		className: 'available-user',
		template: template,
		triggers: {
			'click': 'user:selected'
		},
		initialize: function() {
			
		}
	});

	var UsersListView = Mn.CollectionView.extend({
		className: 'users-list',
		tagName: 'ul',
		initialize: function (options) {
		},
		childView: UserView,
		onRender: function() {
		},
		onChildviewUserSelected: function(view) {
			this.children.each(function(childView) {
				if (childView === view) {
					childView.$el.addClass('selected');
				} else {
					childView.$el.removeClass('selected');
				}
			}.bind(this));
			this.trigger('user:selected', view.model);
		}
	});
	return UsersListView;
});