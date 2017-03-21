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
                    .then(function(game, status){
                        if (status === 'nocontent') {
                            def.reject();
                        } else {
                            var gameModel = this.getGameModel();
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
                        this.onGetAvailableUsers();
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
                    case 'INVITATION_RECEIVED':
                        this.publicController.getGameController().onInvitationReceived();
                        break;
                    case 'INVITATION_SENT':
                        //TODO something???
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
                    default:
                        break;
                }
            },

            onGetAvailableUsers: function() {
                var flag = confirm('get available users?');
                if (flag) {
                    service.getAvailableUsers()
                        .then(function(response){
                            //todo select user
                            if (response.count > 0) {
                                var inviteeUID = response.users[0].uid;
                                this.onSendInvitation(inviteeUID);
                            }
                        }.bind(this), function(err){
                            
                        }.bind(this));
                } else {
                    //todo
                }
            },

            onSendInvitation: function(inviteeUID) {
                service.sendInvitation({
                    inviteeUID: inviteeUID
                }).then(function(result){
                    //TODO what should I do???
                }.bind(this), function(err){
                    //on error
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
                    }.bind(this), function(err){
                        //on error
                    }.bind(this));
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
