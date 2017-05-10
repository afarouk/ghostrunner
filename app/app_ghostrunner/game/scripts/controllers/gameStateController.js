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
                        if(response.games.length > 0 ){
                        // if(response.games.length ==1 && (response.games[0].state == 'RUNNING' || response.games[0].state == 'INVITING' || response.games[0].state == 'ACCEPTED')){
                            // var gameUUID=response.games[0].gameUUID; this.publicController.getGameChoiceController().setGameUUID(gameUUID);
                            
                            // this.selectGame(response);//temporary
                            this.selectGame(response);
                        // }
                        // else if (response.games.length > 1) {                                
                        //     this.selectGame(response);
                        } else {
                            this.onGetAvailableUsers();
                        }
                    }.bind(this), function(err){
                            this.onGetAvailableUsers();
                            this.publicController.getInterfaceController().hideLoader();
                    }.bind(this));
            },

            selectGame: function(response) {
                this.publicController.getGameChoiceController()
                    .showSelect({
                        message: 'Select a game ',
                        confirm: 'Start',
                        list: response.games
                    }).then(function(gameUUID){
                        if(gameUUID){
                            this.publicController.getGameChoiceController().setGameUUID(gameUUID);
                            var game = _.find(response.games, {gameUUID: gameUUID});
                            if (game.state == 'ACCEPTED') {
                                this.startGame(gameUUID);
                            } else {
                                this.refreshStatus();
                            }
                        }                                        
                    }.bind(this)); 
            },

            startGame: function(gameUUID) {
                service.startGame(gameUUID)
                    .then(function(state){
                        this.updateGameModel(state);
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
                var gameUUID=this.publicController.getGameChoiceController().getUrlGameUUID();  
                service.getGame(gameUUID)
                    .then(function(game, status){
                        this.publicController.getGameChoiceController().removeUrlGameUUID();
                        if (status === 'nocontent') {
                            def.reject();
                        } else {
                            var gameModel = this.getGameModel();
                            if (!gameModel) {
                                gameModel = new GameModel(game);
                            } else {
                                gameModel.set(game);                                
                            }
                            // if(game.gameUUID && game.state!='ABANDONED'){
                            //  this.publicController.getGameBtnController().showGameBtns();   
                            // }
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
        
            updateGameModel: function (state) {
                var gameModel = this.getGameModel();
                gameModel.set(state);
                 this.publicController.getStateManager().manage(gameModel);
            },
        
            getUrlGameUUID: function() {
                return appCache.get('urlGameUUID');
            },
        
            refreshStatus: function() {
                this.getGameStatus()
                    .then(function(game){
                        this.publicController.getStateManager().manage(game);                     
                    }.bind(this));
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
                    var gameModel = this.getGameModel();
                    if (!gameModel) {
                        gameModel = new GameModel(result);
                    } else {
                        gameModel.set('gameUUID', result.gameUUID);                               
                    }
                    this.publicController.getGameController().waitingForTurn();
                }.bind(this), function(err){
                    //on error
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
            },

            onRetrieveInvitation: function(message) {
                var gameUUID = message.gameUUID;
                this.onGetMygames(); //temporary tweak
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

            onInvitationRejected: function(game) {
                service.rejectInvitation(game).then(function(){
                    //TODO now still abandon game button here
                    this.onGetAvailableUsers();
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
            }

        });

    return new GameStateController();
});
