/*global define */

'use strict';

define([
	'ejs!../../templates/partials/availablePlayer.ejs'
	], function(template){
	var PlayerView = Mn.View.extend({
		tagName: 'li',
		className: 'available-player',
		template: template,
		triggers: {
			'click': 'player:selected'
		},
		initialize: function() {
			
		}
	});

	var PlayersListView = Mn.CollectionView.extend({
		className: 'players-list',
		tagName: 'ul',
		initialize: function (options) {
			this.button = options.button
		},
		childView: PlayerView,
		onChildviewPlayerSelected: function(view) {
			this.children.each(function(childView) {
				if (childView === view) {
					childView.$el.addClass('selected');
				} else {
					childView.$el.removeClass('selected');
				}
			}.bind(this));
			this.button.attr('disabled', false);
			this.trigger('player:selected', view.model);
		}
	});
	return PlayersListView;
});