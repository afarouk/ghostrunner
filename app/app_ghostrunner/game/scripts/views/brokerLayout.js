/*global define */

'use strict';

define([
	'../Vent',
	'ejs!../templates/brokerLayout.ejs'
	], function(Vent, template){
	var BrokerLayoutView = Mn.View.extend({
		template: template,
		regions: {
			choice: '#player-choice',
			choice_game: '#game-choice',
		},
		onRender: function() {
			this.renderGame();
		},
		renderGame: function() {
			this.publicController.getChoiceController().create(this, 'choice');
            this.publicController.getSelectController().create(this, 'choice_game');
		}
	});
	return BrokerLayoutView;
});