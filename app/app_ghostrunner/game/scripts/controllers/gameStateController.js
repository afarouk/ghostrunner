/*global define */

'use strict';

define([
    '../Vent',
    '../appCache',
    '../models/game',
    '../APIGateway/gameService'
    ], function(Vent, appCache, GameModel, service){
    //A heart of the game state logic 
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
            updateGameModel: function (state) {
                var gameModel = this.getGameModel();
                gameModel.set(state);
                this.manageState(gameModel.get('thisUser'));
            },
            refreshStatus: function() {
                this.getGameStatus()
                    .then(function(game){
                        this.manageState(game.get('thisUser'));
                        this.otherUserState(game.get('otherUser'));
                    }.bind(this));
            },

            otherUserState: function(otherUser) {
                var inGame = false;
                if (otherUser.presence === 'ONLINE') {
                    inGame = true;
                }
                this.publicController.getInformationTableController().opponentInGame(inGame);
            },

            manageState: function(thisUser) {
                switch (thisUser.state) {
                    case 'MAKE_YOUR_MOVE':
                        this.publicController.getGameController().waitingForMove();
                        break;
                    case 'WAIT_FOR_TURN':
                        this.publicController.getGameController().waitingForTurn();
                        break;
                    default:
                        this.publicController.getGameController().waitingForMove();
                        break;
                }
            },
            onMessage: function(signal) {
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
                    case 'GOTO_PREVIOUS_STATE':
                        
                        break;
                    case 'OPPONENT_OFFLINE':
                        this.publicController.getInformationTableController().opponentInGame(false);
                        break;
                    case 'OPPONENT_ONLINE':
                        this.publicController.getInformationTableController().opponentInGame(true);
                        break;
                    default:
                        break;
                }
            },

            onPlayerMove: function() {
                service.makeMove({
                    payload: { 
                        'actionType':1,
                        'actionDetail':'some string'
                    }
                }).then(function(state){
                    this.updateGameModel(state);
                }.bind(this));
            },

            onGameStop: function() {
                var gameModel = this.getGameModel();
                console.log(gameModel);
                //Sould we stop game after 
                //websocket connection was interrupted (disconnected) 
                // the save way as by user decision ???
                // debugger;
                // return;
                if (gameModel) {
                    service.stopGame()
                        .then(function(){
                            gameModel.kill();
                            //TEMPORARY !!!
                            //TODO show modal dialog
                            // $('#reconnect-dialog').modal('show');
                            var choise = confirm('Reconnect websockets?');
                            if (choise) {
                                var user = appCache.get('user'),
                                    params = {
                                        uid: user.get('uid'), 
                                        userName: user.get('userName')
                                    };
                                user.kill();
                                this.publicController.getGameController()
                                    .start(params);
                            } else {
                                //What exactly should be?
                            }
                            //...................
                        }.bind(this));
                }
            }
        });

    return new GameStateController();
});
