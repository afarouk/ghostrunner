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
                
                //Temporary
                var gameUUID=this.publicController.getGameChoiceController().getUrlGameUUID();
                if(gameUUID){
                 this.refreshStatus();   
                }else{
                 this.onGetMygames();   
                } 
            },
        
            onGetMygames: function() {
                this.publicController.getInterfaceController().showLoader();
                service.getMyGames()
                        .then(function(response){
                                this.publicController.getInterfaceController().hideLoader();
                            if(response.games.length ==1){
                                var gameUUID=response.games[0].gameUUID; this.publicController.getGameChoiceController().setGameUUID(gameUUID);
                                this.refreshStatus();  
                            }
                            else if (response.games.length > 1) {                                
                                this.publicController.getGameChoiceController()
                                    .showSelect({
                                        message: 'Select a game ',
                                        confirm: 'Start',
                                        list: response.games
                                    }).then(function(gameUUID){
                                        if(gameUUID){
                                            this.publicController.getGameChoiceController().setGameUUID(gameUUID);
                                           this.refreshStatus();   
                                        }                                        
                                    }.bind(this));
                            } else {
                                this.onGetAvailableUsers();
                            }
                        }.bind(this), function(err){
                                this.onGetAvailableUsers();
                                this.publicController.getInterfaceController().hideLoader();
                        }.bind(this));
            },
        
            getGameUser: function() {
                 service.getGameUser()
                    .then(function(status){
                        if (status && status.gameUUID) {
                            this.refreshStatus();
                        } else {
                            this.onGetAvailableUsers();
                        }
                    }.bind(this)); 
                
            },
        
            getGameStatus: function() {
                //TODO maybe we should use native backbone fetch mechanism ???
                var def = $.Deferred();
                var gameUUID=this.publicController.getGameChoiceController().getUrlGameUUID();  service.getGame(gameUUID)
                    .then(function(game, status){
                        this.publicController.getGameChoiceController().removeUrlGameUUID();
                        if (status === 'nocontent') {
                            def.reject();
                        } else {
                            var gameModel = this.getGameModel();
                            if(game.gameUUID && game.state!='ABANDONED'){
                             this.publicController.getGameBtnController().showAbandonBtn();   
                            }
                            if (!gameModel) {
                                gameModel = new GameModel(game);
                            } else {
                                gameModel.set(game);                                
                            }
                            def.resolve(gameModel);
                        }
                    }.bind(this), function(err){
                        //TODO manage User not in game warning or other error
                        console.log('waiting on get game error...');
                        this.publicController.getGameChoiceController().removeUrlGameUUID();
                        this.onGetAvailableUsers();
                    }.bind(this));
                return def;
            },
        
            getGameModel: function() {
                return appCache.get('game');
            },
        
            getUrlGameUUID: function() {
                return appCache.get('urlGameUUID');
            },
        
            refreshStatus: function() {
                this.getGameStatus()
                    .then(function(game){
                        this.manageState(game);
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

            manageState: function(gameModel) {
                var thisUser = gameModel.get('thisUser');
                switch (thisUser.state) {
                    case 'MAKE_YOUR_MOVE':
                        this.publicController.getGameController().waitingForMove();
                        break;
                    case 'WAIT_FOR_TURN':
                        this.publicController.getGameController().waitingForTurn();
                        break;
                    case 'INVITATION_RECEIVED':
                        this.publicController.getGameController().onInvitationReceived();
                        break;
                    case 'INVITATION_SENT':
                        //TODO something???
                        break;
                    case 'AVAILABLE':
                        if (gameModel.get('state') === 'COMPLETE') {
                            this.publicController.getGameController().onAvailableForNewGame();
                        }
                        break;
                    case 'ABANDONED':
                        this.publicController.getGameBtnController().hideAbandonBtn();
                        this.publicController.getGameBtnController().removeGameUUID();
                        break;
                    default:
                        //TODO default???
                        //this.publicController.getGameController().waitingForMove();
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
                    case 'INVITATION_RECEIVED':
                        this.onRetrieveInvitation();
                        break;
                    case 'INVITATION_ACCEPTED':
                        this.refreshStatus();
                        break;
                    case 'GAME_OVER':
                        //TODO I am not sure what to do ???
                        this.refreshStatus();
                        break;
                    case 'GAME_ABANDONED':
                        this.publicController.getGameBtnController().hideAbandonBtn();
                        this.publicController.getGameBtnController().removeGameUUID();
                        break;
                    default:
                        break;
                }
            },

            onGetAvailableUsers: function() {
                this.publicController.getPlayerChoiceController().showConfirmation({
                    message: 'get available users?',
                    cancel: 'cancel',
                    confirm: 'ok'
                }).then(function(){
                    service.getAvailableUsers()
                        .then(function(response){
                            //todo select user
                            if (response.count > 0) {
                                this.publicController.getPlayerChoiceController()
                                    .showSelect({
                                        message: 'Select some user:',
                                        confirm: 'invite',
                                        list: response.users
                                    }).then(function(inviteeUID){
                                        this.onSendInvitation(inviteeUID);
                                    }.bind(this));
                            } else {
                                //TODO something
                                this.publicController.getInterfaceController().hideLoader();
                            }
                        }.bind(this), function(err){
                            
                        }.bind(this));
                }.bind(this), function() {
                    //TODO something
                }.bind(this));
            },

            onSendInvitation: function(inviteeUID) {
                service.sendInvitation({
                    inviteeUID: inviteeUID
                }).then(function(result){
                    //TODO what should I do???
                }.bind(this), function(err){
                    //on error
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
            },

            onRetrieveInvitation: function() {
                //That approach doesn't make any sense
                //if game model changed

                // service.retrieveInvitation()
                //     .then(function(invitation){
                //         debugger
                //     }.bind(this), function(err){
                //         //on error
                //     }.bind(this));

                //I think that I need only getgame or update game???
                this.refreshStatus();
            },

            onInvitationAccepted: function() {
                //dateInvited:"2017-03-20T11:38:12.766+0000"
                //fromUID:"user38.4163954949559135759"
                //fromUsername:"member18"
                //gameUUID:"l-w21tg_TiKAAABWNCMi_VI52yuCpc8"
                //toUID:"user20.781305772384780045"
                service.acceptInvitation()
                    .then(function(state){
                        this.updateGameModel(state);
                        this.publicController.getInformationTableController().opponentInGame(true);
                    }.bind(this), function(err){
                        //on error
                    }.bind(this));
            },

            onInvitationRejected: function() {
                this.onGetAvailableUsers();
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

            onPlayerLogout: function() {
                var gameModel = this.getGameModel();
                console.log(gameModel);
                if (gameModel) {
                    gameModel.kill();
                }
                this.publicController.getGameController().destroy();
                this.App.destroy();
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
                    service.resetGame()
                        .then(function(){
                            gameModel.kill();
                            //TEMPORARY !!!
                            //TODO show modal dialog
                            // $('#reconnect-dialog').modal('show');
                            // var choise = confirm('Reconnect websockets?');
                            // if (choise) {
                            //     var user = appCache.get('user'),
                            //         params = {
                            //             uid: user.get('uid'), 
                            //             userName: user.get('userName')
                            //         };
                            //     user.kill();
                            //     this.publicController.getGameController()
                            //         .start(params);
                            // } else {
                            //     //What exactly should be?
                            //     this.publicController.destroyGame(); //???
                            // }
                            //...................
                        }.bind(this));
                }
            }

        });

    return new GameStateController();
});
