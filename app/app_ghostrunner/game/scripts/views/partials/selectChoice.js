/*global define */

'use strict';

define([
	'ejs!../../templates/partials/selectChoice.ejs'
	], function(template){
	var SelectChoiceView = Mn.View.extend({
		className: 'select-choice',
		template: template,
		ui: {
			select: 'select'
		},
		events: {
			'click button': 'onConfirmed'
		},
		onRender: function() {
			
		},
		onConfirmed: function() {
			var uid = this.ui.select.val();
			console.log(uid);
			this.model.get('callback')(uid);
		}
	});
	return SelectChoiceView;
});