/*global define */

'use strict';

define([
	'ejs!../../templates/partials/playersCard.ejs'
	], function(template){
	var PlayersCardView = Mn.View.extend({
		className: 'players-card',
		template: template,
		ui: {
			close: '[name="close"]'
		},
		events: {
			'click @ui.close': 'onClose'
		},
		onRender: function() {
			
		},
		onClose: function() {
			this.model.get('callback')();
		}
	});
	return PlayersCardView;
});