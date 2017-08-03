/*global define */

'use strict';

define([
	'../../appCache',
	'../../APIGateway/gameService',
    '../../views/gameField'
    ], function(appCache, service, GameFieldView){
    var GameFieldController = Mn.Object.extend({
		create: function(layout, region) {
			var gameModel = appCache.get('game');
			this.view = new GameFieldView({
				model: gameModel.getBaseballFieldModel()
			});
			gameModel.on('change', this.onGameModelChange.bind(this));
			layout.showChildView( region, this.view );
			this.listenTo(this.view, 'onPlayerCard', this.onPlayerCard.bind(this));
			this.view.triggerMethod('initContext');
		},
		onPlayerCard: function(player) {
			service.retrievePlayerCard({
				playerId: player.playerId,
				seasonId: player.seasonId,
				leagueId: player.leagueId,
				playerRoleId: player.playerRoleId,
				position: player.position.enumText
			}).then(function(card) {
				this.publicController.getChoiceController().showPlayersCard(card);
			}.bind(this));
		},
		onGameModelChange: function(gameModel) {
			this.view.model.set(gameModel.getBaseballFieldModel())
		}
    });

    return new GameFieldController();
});
