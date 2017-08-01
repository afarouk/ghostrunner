/*global define */

'use strict';

define([
    '../../appCache',
    '../../models/game',
    '../../APIGateway/gameService'
    ], function(appCache, GameModel, service){

    var GameStateController = Mn.Object.extend({
        onGameStart: function() {
            this.publicController.getGameController().showLoader();
            service.getMyRunningGame()
                .then(function(response){
                    this.publicController.getGameController().hideLoader();
                    if (response.games.length > 0) {
                        this.publicController.getModalsController().onRuningGamePresented(response.games[0]);
                    }
                }.bind(this), function(xhr){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getModalsController().ApiErrorPopup(xhr);                   
                }.bind(this));
        },

        startGame: function(gameUUID, role) {
            service.startGame(gameUUID, role)
                .then(function(state){
                    this.updateGameModel(state);
                }.bind(this),function(xhr){
                    this.publicController.getModalsController().ApiErrorPopup(xhr);
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
                }.bind(this), function(xhr){
                    //TODO manage User not in game warning or other error
                    this.publicController.getGameController().hideLoader();
                    console.log('waiting on get game error...');
                    this.publicController.getModalsController().ApiErrorPopup(xhr);
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
                }.bind(this),function(xhr){
                    this.publicController.getModalsController().ApiErrorPopup(xhr);
                }.bind(this));
        },

        notifyOpponentOfGameResumption: function(gameUUID) {
            service.notifyOpponentOfGameResumption(gameUUID)
                .then(function(game){
                    this.refreshStatus(gameUUID);
                }.bind(this),function(xhr){
                    this.publicController.getModalsController().ApiErrorPopup(xhr);
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
                }.bind(this), function(xhr){
                    //on error
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getModalsController().ApiErrorPopup(xhr);
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
                    this.publicController.getModalsController().ApiErrorPopup(err);
                }.bind(this));
        },

        onRetrieveInvitation: function(message) {
            this.beforeRefreshStatus(message);
        },

        afterCandidateSelected: function(team, lineUpName, playerModel) {
            var teamUUID = team.get('teamUUID'),
                teamId = team.get('teamId'),
                teamType = team.get('type').enumText,
                player = {
                    playerId: playerModel.get('playerId'),
                    seasonId: playerModel.get('seasonId'),
                    leagueId: playerModel.get('leagueId'),
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
            }.bind(this), function(xhr) {
                //on error
                this.publicController.getModalsController().ApiErrorPopup(xhr);
            }.bind(this));
        },

        beforeRefreshStatus: function(message) {
            var gameUUID = message.gameUUID,
                gameModel = this.getGameModel();
            if (gameModel && gameModel.get('gameUUID') !== gameUUID) {
                this.publicController.getModalsController().onMessageFromAnotherUser()
                    .then(function(){
                        this.onPauseGame(gameModel.get('gameUUID'))
                            .then(function(status){
                                this.publicController.getGameController().hideLoader();
                                this.publicController.getGameController().switchToBroker();
                                this.onPayloadMsgBeforeRefresh(message);
                            }
                            .bind(this), function(xhr){
                                this.publicController.getModalsController().ApiErrorPopup(xhr);
                                this.publicController.getGameController().hideLoader();
                            }.bind(this));
                    }.bind(this), function(){
                        //ignore message
                    }.bind(this));
            } else {
                this.onPayloadMsgBeforeRefresh(message);
            }
        },

        onPayloadMsgBeforeRefresh: function(message) {
            if (message.signal === 'STARTER_SELECTED' ||
                message.signal === 'LINEUP_SELECTED') {
                this.publicController.getModalsController().onPayloadMessage(message)
                    .then(function() {
                        this.refreshStatus(message.gameUUID);
                    }.bind(this), function(xhr){
                        //do nothing
                        this.publicController.getModalsController().ApiErrorPopup(xhr);
                    }.bind(this));
            } else {
                this.refreshStatus(message.gameUUID);
            }
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
                this.publicController.getModalsController().ApiErrorPopup(err);
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
                        }.bind(this),function(xhr){
                            this.publicController.getModalsController().ApiErrorPopup(xhr);
                    }.bind(this));
                }.bind(this));
            }
        },

        onInvitationRejected: function(game) {
            service.rejectInvitation(game).then(function(){
                this.publicController.getBrokerController().reRender();
            }.bind(this),function(xhr){
                this.publicController.getModalsController().ApiErrorPopup(xhr);
            }.bind(this));
        },

        onPlayerMove: function(moveEnum) {
            service.makeMove({
                payload: {
                    'actionType':1, //I left that fields, because
                    'actionDetail':'some string', //It can be necessary in a future
                    'gameMove': moveEnum
                }
            }).then(function(state){
                 if((moveEnum == 'SWING_AWAY' ||moveEnum == 'BUNT_ATTEMPT' || moveEnum == 'STEAL_BASE' || moveEnum == 'HIT_N_RUN_ATTEMP' || moveEnum == 'PITCH_TO_BATTER' || moveEnum == 'INTENTIONAL_WALK')&& state.thisUser.state == "MAKE_YOUR_MOVE")
                 {   
                    this.refreshStatus(state.gameUUID);
                 }
                 else
                 {
                   this.checkForSecondaryMove(state, true);
                 }
            }.bind(this),function(xhr){
                this.publicController.getModalsController().ApiErrorPopup(xhr);
            }.bind(this));
        },

        checkForSecondaryMove: function(state, update) {
            var events = state.thisUser.events;
            if (_.isEmpty(events)) {
                if (update) this.updateGameModel(state);
            } else {
                var secondary = _.findWhere(events, {type: 'CHOICE_NEEDED'});
                if (secondary) {
                    this.publicController.getModalsController().onSecondaryMove(secondary);
                } else {
                    if (update) this.updateGameModel(state);
                }
            }
        },

        makeSecondaryMove: function(eventId, choiceId) {
            service.makeSecondaryMove({
                eventId: eventId,
                choiceId: choiceId
            }).then(function(state){
                this.updateGameModel(state);
            }.bind(this),function(xhr){
                this.publicController.getModalsController().ApiErrorPopup(xhr);
            }.bind(this));
        },

        onPlayerLogout: function() {
            this.killGame();
            this.publicController.getGameController().destroy();
            this.App.destroy();
        },

        onPauseGame: function(gameUUID) {
            var $def = $.Deferred();
            service.pauseGame(gameUUID)
                .then(function(){
                    this.killGame();
                    $def.resolve();
                }.bind(this), function(err){
                    $def.reject();
                    this.publicController.getModalsController().ApiErrorPopup(err);
                }.bind(this));
            return $def;
        },

        unPauseGame: function(gameUUID) {
            service.unPauseGame(gameUUID)
                .then(function(status){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getStateController().refreshStatus(gameUUID);
                }
                .bind(this), function(err){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getModalsController().ApiErrorPopup(err);
                }.bind(this));
        },

        killGame: function() {
            var gameModel = this.getGameModel();
            if (gameModel) {
                gameModel.kill();
            }
        },

        onGameStop: function() {
            this.killGame();
        },

        onForceLogout: function() {
            this.disconnectLocked = true;
            this.publicController.getModalsController().onForceLogout()
                .then(function(){
                    this.disconnectLocked = false;
                    this.killGame();
                    this.publicController.getGameController().destroy();
                    $(window).trigger('ghostrunner.afterLogout');
                }.bind(this),function(xhr){
                     this.publicController.getModalsController().ApiErrorPopup(err);
                }.bind(this))
        },

        onDestroy: function() {
            if (this.disconnectLocked) return;
            var user = appCache.get('user');
            this.killGame();
            this.publicController.getModalsController().onConnectionLost()
                .then(function(){
                    this.publicController.getGameController().destroy();
                    this.publicController.getGameController().start(user.toJSON());
                }.bind(this), function(){
                    this.publicController.getGameController().stop(user.get('uid'));
                    $(window).trigger('ghostrunner.afterLogout');
                }.bind(this))
        },
    });

    return new GameStateController();
});
