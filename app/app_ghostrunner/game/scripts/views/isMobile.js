/*global define */

'use strict';

define([
	'ejs!../templates/isMobile.ejs'
	], function(template){
	var IsMobileView = Mn.View.extend({
		template: template,
		el: '#play-the-game',
		ui: {
			play: '.placeholder'
		},
		triggers: {
			'click @ui.play': 'open:game'
		},
		onRender: function() {
			// debugger;
		}
	});
	return IsMobileView;
});