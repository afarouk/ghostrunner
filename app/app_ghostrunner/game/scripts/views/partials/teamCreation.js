/*global define */

'use strict';

define([
	'../../Vent',
	'ejs!../../templates/partials/teamCreation.ejs',
	], function(Vent, template){
	var TeamCreationView = Mn.View.extend({
		template: template,
		tagName: 'section',
		className: 'create-team',
		onRender: function() {
			console.log('team creation');
		},
		serializeData: function() {
			return {
				players: this.options.players,
				positions: this.options.positions
			};
		}
	});
	return TeamCreationView;
});