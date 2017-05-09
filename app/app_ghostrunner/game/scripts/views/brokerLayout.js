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
			this.publicController.getPlayerChoiceController().create(this, 'choice');
            this.publicController.getGameChoiceController().create(this, 'choice_game');
		}
	});
	return BrokerLayoutView;
});