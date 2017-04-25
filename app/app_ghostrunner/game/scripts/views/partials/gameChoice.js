/*global define */

'use strict';

define([
	'ejs!../../templates/partials/gameChoice.ejs'
	], function(template){
	var GameChoiceView = Mn.View.extend({
		className: 'game-choice',
		template: template,
		regions: {
			select: '.game-select-choice'
		},
		onRender: function() {
			
		}
	});
	return GameChoiceView;
});