/*global define */

'use strict';

define([
    '../../Vent',
    '../../models/user',
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/appLayout'
    ], function(Vent, userModel, appCache, service, AppLayout){
    var GameController = Mn.Object.extend({
        start: function(user){
            console.log('game start');

            this.createUser(user);
            console.log(user);

            var appLayout = new AppLayout();
            appLayout.render();
            this.appLayout = appLayout;

            this.publicController.getSocketController().start(user.uid);
        },
        showGame: function() {
            this.appLayout.getRegion('game').$el.addClass('active');
        },
        hideGame: function() {
            this.appLayout.getRegion('game').$el.removeClass('active');
        },
        showBroker: function() {
            this.appLayout.getRegion('broker').$el.addClass('active');
            this.publicController.getBrokerController().reRender();
        },
        hideBroker: function() {
            this.appLayout.getRegion('broker').$el.removeClass('active');
        },
        createUser: function(user) {
            new userModel({
                uid: user.uid, 
                userName: user.userName
            });
        },
        stop: function(uid) {
            console.log('game stop');
            var user = appCache.get('user');
            user.kill();
            this.publicController.getStateController().onPlayerLogout();
        },
        destroy: function() {
            this.appLayout.destroyView();
            this.publicController.destroyGame();
        },
        waitingForMove: function() {
            this.publicController.getInterfaceController().hideLoader();
        },
        waitingForTurn: function() {
            console.log('waiting for turn');
            this.publicController.getInterfaceController().showLoader();
        },
        onInvitationReceived: function() {
            var game = appCache.get('game'),
                other = game.get('otherUser').user.userName,
                gameName = game.get('displayText');
            this.publicController.getChoiceController().showConfirmation({
                message: other + ' sent you invitation to '+ gameName + '<br> accept invitation?',
                cancel: 'cancel',
                reject: 'no',
                confirm: 'yes'
            }).then(function(){
                this.publicController.getStateController().onInvitationAccepted();
            }.bind(this), function(type) {
                //TODO something
                if (type === 'reject') {
                    this.publicController.getStateController().onInvitationRejected(game);
                } else {
                    // this.publicController.getStateController().onGetMygames();
                }
            }.bind(this));
            console.log('invitation received');
        },

        onPausedByOponnent: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Game paused by oponnent.',
                confirm: 'ok'
            }).then(function() {
                this.publicController.getGameController().showBroker();
                this.publicController.getGameController().hideGame();
                this.publicController.getStateController().refreshStatus();
            }.bind(this));
            console.log('invitation received');
        },

        onAbandoneGame: function() {
            // var game = appCache.get('game'),
            //     other = game.get('otherUser').user.userName,
            //     gameName = game.get('displayText');
            this.publicController.getChoiceController().showConfirmation({
                message: 'Abandon the game (final)?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.publicController.getInterfaceController().showLoader();
                service.abandonGame()
                .then(function(status){
                    this.publicController.getInterfaceController().hideLoader();
                    this.publicController.getGameController().showBroker();
                    this.publicController.getGameController().hideGame();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(err){
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
            }.bind(this), function() {
                //todo
            }.bind(this));
        },

        onAbandonedByOponnent: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Game abandoned by oponnent.',
                confirm: 'ok'
            }).then(function() {
                this.publicController.getGameController().showBroker();
                this.publicController.getGameController().hideGame();
                this.publicController.getStateController().refreshStatus();
            }.bind(this));
            console.log('invitation received');
        },

        onGameOver: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Game over.',
                confirm: 'ok'
            }).then(function() {
                this.publicController.getGameController().showBroker();
                this.publicController.getGameController().hideGame();
                this.publicController.getStateController().refreshStatus();
            }.bind(this));
            console.log('invitation received');
        },

        onAbandoneGame: function() {
            // var game = appCache.get('game'),
            //     other = game.get('otherUser').user.userName,
            //     gameName = game.get('displayText');
            this.publicController.getChoiceController().showConfirmation({
                message: 'Abandon the game (final)?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.publicController.getInterfaceController().showLoader();
                service.abandonGame()
                .then(function(status){
                    this.publicController.getInterfaceController().hideLoader();
                    this.publicController.getGameController().showBroker();
                    this.publicController.getGameController().hideGame();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(err){
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
            }.bind(this), function() {
                //todo
            }.bind(this));
        },

        onUnpauseGame: function (gameUUID) {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Unpause this game?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.publicController.getStateController().unPauseGame(gameUUID);
            }.bind(this), function() {
                this.publicController.getGameController().showBroker();
                this.publicController.getGameController().hideGame();
            }.bind(this));
        }
    });

    return new GameController();
});
