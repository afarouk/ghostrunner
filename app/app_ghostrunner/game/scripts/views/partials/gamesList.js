/*global define */

'use strict';

define([
	'ejs!../../templates/partials/myGame.ejs'
	], function(template){
	var GameView = Mn.View.extend({
		tagName: 'li',
		className: 'my-game',
		template: template,
		triggers: {
			'click': 'player:selected'
		},
		initialize: function() {
			
		}
	});

	var GamesListView = Mn.CollectionView.extend({
		className: 'games-list',
		tagName: 'ul',
		initialize: function (options) {
		},
		childView: GameView,
		onChildviewPlayerSelected: function(view) {
			this.children.each(function(childView) {
				if (childView === view) {
					childView.$el.addClass('selected');
				} else {
					childView.$el.removeClass('selected');
				}
			}.bind(this));
			this.trigger('game:selected', view.model);
		}
	});
	return GamesListView;
});