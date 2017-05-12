/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../models/game',
    '../../APIGateway/gameService'
    ], function(Vent, appCache, GameModel, service){
    //A heart of the game state logic 
    var GameStateController = Mn.Object.extend({
        onGameStart: function() {
            //Temporary
            var gameUUID=this.publicController.getSelectController().getUrlGameUUID();
            this.publicController.getInterfaceController().hideLoader();
            return;
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
                    if( response.games.length > 0 ){
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
            this.publicController.getSelectController()
                .showSelect({
                    message: 'Select a game ',
                    confirm: 'Start',
                    list: response.games
                }).then(function(gameUUID){
                    if(gameUUID){
                        this.publicController.getSelectController().setGameUUID(gameUUID);
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
                        // this.onGetAvailableUsers();
                    }
                }.bind(this)); 
            
        },
    
        getGameStatus: function(gameUUID) {
            var def = $.Deferred();
            var gameUUID = gameUUID || this.publicController.getSelectController().getUrlGameUUID();  
            service.getGame(gameUUID)
                .then(function(game, status){
                    this.publicController.getSelectController().removeUrlGameUUID();
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
                    this.publicController.getSelectController().removeUrlGameUUID();
                    // this.onGetAvailableUsers();
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
    
        refreshStatus: function(gameUUID) {
            this.getGameStatus(gameUUID)
                .then(function(game){
                    this.publicController.getStateManager().manage(game);                     
                }.bind(this));
        },

        onGetAvailableUsers: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'get available users?',
                cancel: 'cancel',
                confirm: 'yes'
            }).then(function(){
                service.getAvailableUsers()
                    .then(function(response){
                        //todo select user
                        if (response.count > 0) {
                            this.publicController.getChoiceController()
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
            this.refreshStatus(gameUUID);
            // this.onGetMygames(); //temporary tweak
        },

        onInvitationAccepted: function() {
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
                // this.onGetAvailableUsers();
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
