/*global define */

'use strict';

define([
	'ejs!../../templates/partials/emptyList.ejs',
	], function(template){
	var EmptyListView = Mn.View.extend({
		template: template,
		tagName: 'ul',
		onRender: function() {
		}
	});
	return EmptyListView;
});