/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/modalsLayout.ejs',
	], function(Vent, template){
	var ModalsLayoutView = Mn.View.extend({
		template: template,
		className: 'modals-layout',
		regions: {
			container: '#modals-container'
		},
		onRender: function() {
			console.log('ModalsView');
		}
	});
	return ModalsLayoutView;
});