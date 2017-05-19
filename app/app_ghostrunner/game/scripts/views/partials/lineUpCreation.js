/*global define */

'use strict';

define([
	'../../Vent',
	'ejs!../../templates/partials/lineUpCreation.ejs',
	], function(Vent, template){
	var LineUpCreationView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-lineUp',
		onRender: function() {
			console.log('lineUp creation');
		},
		serializeData: function() {
			return {
				players: this.options.players,
				positions: this.options.positions
			};
		}
	});
	return LineUpCreationView;
});