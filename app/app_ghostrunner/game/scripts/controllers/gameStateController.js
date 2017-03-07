/*global define */

'use strict';

define([
    '../Vent',
    '../appCache',
    '../models/game',
    '../APIGateway/gameService'
    ], function(Vent, appCache, GameModel, service){
    var GameStateController = Mn.Object.extend({
            start: function() {
                this.refreshStatus();
            },
            getGameStatus: function() {
                //TODO maybe we should use nateve backbone fetch mechanism ???
                var def = $.Deferred();
                service.getGame()
                    .then(function(game){
                        var gameModel = this.getGameModel();
                        if (!gameModel) {
                            gameModel = new GameModel(game);
                        } else {
                            gameModel.set(game);
                        }
                        def.resolve(gameModel);

                    }.bind(this));
                return def;
            },
            getGameModel: function() {
                return appCache.get('game');
            },
            refreshStatus: function() {
                this.getGameStatus()
                    .then(function(game){
                        this.manageState(game.get('gameState'));
                    }.bind(this));
            },
            
            //TODO manage different states and signals
            manageState: function(state) {
                if (state.moveState === 'MAKE_YOUR_MOVE') {
                    //TODO wait move
                    this.publicController.getGameController().waitingForMove();
                } else if (state.moveState === 'WAIT_FOR_TURN'){
                    //TODO wait turn
                    this.publicController.getGameController().waitingForTurn();
                }
            },
            onSignal: function(signal) {
                if (signal === 'YOUR_MOVE') {
                    //TODO wait move
                    this.publicController.getGameController().waitingForMove();
                }
            },
            //..............

            onPlayerMove: function() {
                service.makeMove();
            }
        });

    return new GameStateController();
});
