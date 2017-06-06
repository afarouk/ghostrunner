/*global define */

'use strict';

define([
	'ejs!../templates/modalsLayout.ejs',
	], function(template){
	var ModalsLayoutView = Mn.View.extend({
		template: template,
		className: 'modals-layout',
		regions: {
			container: '#modals-container'
		},
		onRender: function() {
		}
	});
	return ModalsLayoutView;
});