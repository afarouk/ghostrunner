/*global define */

'use strict';

define([
	'ejs!../templates/isMobile.ejs'
	], function(template){
	var IsMobileView = Mn.View.extend({
		template: template,
		el: '#game-layout',
		onRender: function() {
			// debugger;
		}
	});
	return IsMobileView;
});