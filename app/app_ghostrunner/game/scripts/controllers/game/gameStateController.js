/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../models/game',
    '../../APIGateway/gameService'
    ], function(Vent, appCache, GameModel, service){

    var GameStateController = Mn.Object.extend({
        onGameStart: function() {
            this.publicController.getInterfaceController().hideLoader();
        },

        startGame: function(gameUUID) {
            service.startGame(gameUUID)
                .then(function(state){
                    this.updateGameModel(state);
                }.bind(this));
        },
    
        getGameUser: function() {
            debugger;
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
                this.publicController.getBrokerController().reRender();
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

        unPauseGame: function(gameUUID) {
            service.unPauseGame(gameUUID)
                .then(function(status){
                    this.publicController.getInterfaceController().hideLoader();
                    this.publicController.getStateController().refreshStatus(gameUUID);
                }
                .bind(this), function(err){
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
        }

    });

    return new GameStateController();
});
