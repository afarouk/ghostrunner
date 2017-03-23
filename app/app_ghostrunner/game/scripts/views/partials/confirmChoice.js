/*global define */

'use strict';

define([
	'ejs!../../templates/partials/ConfirmChoice.ejs'
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
			console.log(action);
			this.model.get('callback')(action);
		}
	});
	return ConfirmChoiceView;
});