/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/informationTable.ejs',
	], function(Vent, template){
	var InformationTableView = Mn.View.extend({
		template: template,
		className: 'information-table-container',
		modelEvents: {
	        'change': 'render'
	    },
		onRender: function() {
			console.log('InformationTableView');
		}
	});
	return InformationTableView;
});