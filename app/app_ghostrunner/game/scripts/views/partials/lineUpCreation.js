/*global define */

'use strict';

define([
	'../../Vent',
	'ejs!../../templates/partials/lineUpCreation.ejs',
	'./lineUpPlayersList'
	], function(Vent, template, LineUpPlayersList){
	var LineUpCreationView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-lineUp',
		regions: {
			players: '.players-list-container table'
		},
		onRender: function() {
			console.log('lineUp creation');
			var lineUpPlayersList = new LineUpPlayersList({
				collection: this.options.players,
				positions: this.options.positions
			});
			this.showChildView('players', lineUpPlayersList);
		}
	});
	return LineUpCreationView;
});