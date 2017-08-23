/*global define */

'use strict';

define([
	'ejs!../../templates/partials/confirmChoice.ejs'
	], function(template){
	var ConfirmChoiceView = Mn.View.extend({
		className: 'confirm-choice',
		template: template,
		ui: {
			action: '[name="action"]'
		},
		events: {
			'click button': 'onButtonClicked',
			'click @ui.action': 'onAction'
		},
		initialize: function (options) {

		},
		onRender: function() {

		},
		onButtonClicked: function (e) {
			var $target = $(e.currentTarget),
				action = $target.data('action');
			this.model.get('callback')(action);
		},
		onAction: function() {
			this.trigger('player:card');
		}
	});
	return ConfirmChoiceView;
});
