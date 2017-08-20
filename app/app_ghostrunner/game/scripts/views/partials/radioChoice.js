/*global define */

'use strict';

define([
	'ejs!../../templates/partials/radioChoice.ejs'
	], function(template){
	var RadioChoiceView = Mn.View.extend({
		className: 'radio-choice',
		template: template,
		ui: {
			radio: '[name="second-move-choices"]',
			send: '[name="send"]'
		},
		events: {
			'change @ui.radio': 'onRadioChecked',
			'click @ui.send': 'onSend'
		},
		initialize: function (options) {
		},
		onRender: function() {

		},
		onRadioChecked: function() {
			this.ui.send.attr('disabled', false);
		},
		onSend: function () {
			var $checked = this.$el.find('[type="radio"]:checked'),
				choiceId = $checked.val();
			this.model.get('callback')(choiceId);
		}
	});
	return RadioChoiceView;
});
