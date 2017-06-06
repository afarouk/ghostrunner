/*global define */

'use strict';

define([
    '../../appCache',
    '../../models/game',
    '../../APIGateway/gameService'
    ], function(appCache, GameModel, service){

    var GameStateController = Mn.Object.extend({
        onGameStart: function() {
            // this.publicController.getGameController().hideLoader();
        },

        startGame: function(gameUUID, role) {
            service.startGame(gameUUID, role)
                .then(function(state){
                    this.updateGameModel(state);
                }.bind(this));
        },

        getGameStatus: function(gameUUID) {
            var def = $.Deferred();
            var gameUUID = gameUUID || this.publicController.getBrokerController().getUrlGameUUID(); 
            if (!gameUUID) return def;
            this.publicController.getGameController().showLoader();
            service.getGame(gameUUID)
                .then(function(game, status){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getBrokerController().removeUrlGameUUID();
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
                    this.publicController.getGameController().hideLoader();
                    console.log('waiting on get game error...');
                    this.publicController.getBrokerController().removeUrlGameUUID();
                }.bind(this));
            return def;
        },
               
        getGameModel: function() {
            return appCache.get('game');
        },
    
        updateGameModel: function (state) {
            var gameModel = this.getGameModel(),
                state = state.attributes ? state.attributes : state;
            gameModel.set(state);
            this.publicController.getStateManager().manage(gameModel);
        },
    
        getUrlGameUUID: function() {
            return appCache.get('urlGameUUID');
        },
    
        refreshStatus: function(gameUUID) {
            this.getGameStatus(gameUUID)
                .then(function(game){
                    this.updateGameModel(game);                  
                }.bind(this));
        },

        restartGame: function(gameUUID) {
            service.restartGame(gameUUID)
                .then(function(game){
                    this.refreshStatus(gameUUID);
                }.bind(this));
        },

        onCheckRestart: function(gameUUID) {
            //if user already in this game don't show confirmation 
            var gameModel = this.getGameModel();
            if (gameModel && gameUUID === gameModel.get('gameUUID')) {
                this.refreshStatus(gameUUID);
            } else {
                this.publicController.getModalsController().onStartGameConfirmation(gameUUID);
            }
        },

        onSendInvitation: function(credentials) {
            var onInvitationSent = credentials.callback;
            delete credentials.callback;
            service.selectStarterAndInvite(credentials)
                .then(function(result){
                    var gameModel = this.getGameModel();
                    if (!gameModel) {
                        gameModel = new GameModel(result);
                    } else {
                        gameModel.set('gameUUID', result.gameUUID);                               
                    }
                    onInvitationSent(true, result);
                    this.updateGameModel(result);
                }.bind(this), function(err){
                    //on error
                    this.publicController.getGameController().hideLoader();
                }.bind(this));
        },

        onSendInvitationByEmail: function(credentials) {
            var onInvitationSent = credentials.callback;
            delete credentials.callback;
            service.selectStarterAndInviteAndRegister(credentials)
                .then(function(result){
                    var gameModel = this.getGameModel();
                    if (!gameModel) {
                        gameModel = new GameModel(result);
                    } else {
                        gameModel.set('gameUUID', result.gameUUID);                               
                    }

                    onInvitationSent(true, result);
                    this.updateGameModel(result);
                }.bind(this), function(err){
                    onInvitationSent(false, err);
                }.bind(this));
        },

        onRetrieveInvitation: function(message) {
            var gameUUID = message.gameUUID;
            this.refreshStatus(gameUUID);
        },

        afterCandidateSelected: function(team, lineUpName, playerModel) {
            var teamUUID = team.get('teamUUID'),
                teamId = team.get('teamId'),
                teamType = team.get('type').enumText,
                player = {
                    playerId: playerModel.get('playerId'),
                    seasonId: playerModel.get('seasonId'),
                    position: playerModel.get('position').enumText,
                };
            service.selectStarter({
                teamUUID: teamUUID,
                teamId: teamId,
                teamType: teamType,
                lineUpDisplayText: lineUpName,
                player: player
            }).then(function(state) {
                this.publicController.getBrokerController().reRender();
                this.updateGameModel(state);
            }.bind(this), function(err) {
                //on error
            }.bind(this));
        },

        onInvitationAccepted: function(lineUpData, role) {
            service.selectLineUpAndAccept({
                preferredRole: role,
                payload: lineUpData
            }).then(function(state){
                this.publicController.getBrokerController().reRender();
                this.updateGameModel(state);
            }.bind(this), function(err){
                //on error
            }.bind(this));
        },

        afterGameWasAccepted: function(gameModel) {
            var gameUUID = gameModel.get('gameUUID'),
                otherUser = gameModel.get('otherUser'),
                initiator = gameModel.get('thisUser').initiator;

            if (initiator) {
                this.publicController.getChoiceController().showConfirmation({
                    message: 'Your invitation to ' + otherUser.user.userName + ' was accepted.',
                    confirm: 'ok'
                }).then(function() {
                    this.publicController.getModalsController().onSelectRole()
                        .then(function(role) {
                            //TODO select players for game (team)
                            this.startGame(gameUUID, role);
                        }.bind(this));
                }.bind(this));
            }
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
            this.killGame();
            this.publicController.getGameController().destroy();
            this.App.destroy();
        },

        unPauseGame: function(gameUUID) {
            service.unPauseGame(gameUUID)
                .then(function(status){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getStateController().refreshStatus(gameUUID);
                }
                .bind(this), function(err){
                    this.publicController.getGameController().hideLoader();
                }.bind(this));
        },

        killGame: function() {
            var gameModel = this.getGameModel();
            if (gameModel) {
                gameModel.kill();
            }
            this.publicController.getModalsController().onConnectionLost();
        },

        onGameStop: function() {
            this.killGame();
        }

    });

    return new GameStateController();
});
