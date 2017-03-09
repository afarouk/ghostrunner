/*global define */

'use strict';

define([
    '../Vent',
    '../appCache',
    '../models/game',
    '../APIGateway/gameService'
    ], function(Vent, appCache, GameModel, service){
    var GameStateController = Mn.Object.extend({
            onGameStart: function() {
                this.refreshStatus();
            },
            getGameStatus: function() {
                //TODO maybe we should use native backbone fetch mechanism ???
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

            manageState: function(state) {
                switch (state.moveState) {
                    case 'MAKE_YOUR_MOVE':
                        this.publicController.getGameController().waitingForMove();
                        break;
                    case 'WAIT_FOR_TURN':
                        this.publicController.getGameController().waitingForTurn();
                        break;
                    default:
                        break;
                }
            },
            onSignal: function(signal) {
                switch (signal) {
                    case 'YOUR_MOVE':
                        this.publicController.getGameController().waitingForMove();
                        break;
                    case 'REFRESH_STATE':
                        this.refreshStatus();
                        break;
                    case 'SHOW_POLL':
                        
                        break;
                    case 'SHOW_MESSAGE':
                        
                        break;
                    case 'BLOCK_USER':
                        
                        break;
                    default:
                        break;
                }
            },

            onPlayerMove: function() {
                service.makeMove()
                        .then(function(state){
                            this.manageState(state);
                        }.bind(this));
            },

            onGameStop: function() {
                var gameModel = this.getGameModel();
                console.log(gameModel);
                //Sould we stop game after 
                //websocket connection was interrupted (disconnected) 
                // the save way as by user decision ???
                if (gameModel) {
                    service.stopGame()
                        .then(function(){
                            gameModel.kill();
                        }.bind(this));
                }
            }
        });

    return new GameStateController();
});
