/*global define */

'use strict';

define([
	'../../Vent',
	'ejs!../../templates/partials/emptyList.ejs',
	], function(Vent, template){
	var EmptyListView = Mn.View.extend({
		template: template,
		tagName: 'ul',
		onRender: function() {
		}
	});
	return EmptyListView;
});