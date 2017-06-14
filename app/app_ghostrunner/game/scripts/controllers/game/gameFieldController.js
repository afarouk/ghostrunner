/*global define */

'use strict';

define([
	'../../appCache',
	'../../APIGateway/gameService',
    '../../views/gameField'
    ], function(appCache, service, GameFieldView){
    var GameFieldController = Mn.Object.extend({
		create: function(layout, region) {
			this.view = new GameFieldView({
				model: this.getBaseballFieldModel()
			});
			layout.showChildView( region, this.view );
			this.listenTo(this.view, 'onPlayerCard', this.onPlayerCard.bind(this));
			this.view.triggerMethod('initContext');
		},
		getBaseballFieldModel: function() {
			//TEMPORARY > move to model
			var gameModel = appCache.get('game'),
				baseballField = gameModel.get('baseballField'),
				field = {
					FIELD_P: null,
					FIELD_C: null,
					FIELD_1B: null,
					FIELD_2B: null,
					FIELD_3B: null,
					FIELD_SS: null,
					FIELD_LF: null,
					FIELD_CF: null,
					FIELD_RF: null,
					BATTER_LH: null,
					BATTER_RH: null,
					BATTER_1R: null,
					BATTER_2R: null,
					BATTER_3R: null
				};
			_.each(baseballField.defensePlayers, function(player){
				var position = player.position.enumText;
				field[position] = player;
			});
			_.each(baseballField.offensePlayers, function(player){
				var position = player.position.enumText;
				field[position] = player;
			});
			console.log(field);
			return new Backbone.Model(field);
		},
		onPlayerCard: function(player) {
			service.retrievePlayerCard({
				playerId: player.playerId,
				seasonId: player.seasonId
			}).then(function(card) {

			}.bind(this));
		}
    });

    return new GameFieldController();
});
