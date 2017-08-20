/*global define */

'use strict';

define([
	'ejs!../../templates/partials/confirmChoice.ejs'
	], function(template){
	var ConfirmChoiceView = Mn.View.extend({
		className: 'confirm-choice',
		template: template,
		events: {
			'click button': 'onButtonClicked'
		},
		initialize: function (options) {

		},
		onRender: function() {

		},
		onButtonClicked: function (e) {
			var $target = $(e.currentTarget),
				action = $target.data('action');
			this.model.get('callback')(action);
		}
	});
	return ConfirmChoiceView;
});
