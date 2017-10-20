/*global define */

'use strict';

define([
    '../models/user',
    '../appCache',
    '../APIGateway/gameService',
    '../views/appLayout',
    '../views/isMobile'
    ], function(userModel, appCache, service, AppLayout, IsMobile){
    var GameController = Mn.Object.extend({
        isMobile: function() {
            console.log('is mobile');
            var isMobile = new IsMobile();
            isMobile.render();
        },
        start: function(user){
            console.log('game start');

            this.createUser(user);
            console.log(user);

            var appLayout = new AppLayout();
            appLayout.render();
            this.appLayout = appLayout;

            this.publicController.getSocketController().start(user.uid);
        },
        switchToGame: function() {
            if (this.appState === 'GAME') return;
            var gameModel = appCache.get('game'),
                showTossAnimation = gameModel.get('thisUser').showTossAnimation;
            this.appState = 'GAME';
            this.appLayout.renderGame(showTossAnimation);

            //show toss animation only first time but we could set it true if we need
            if (showTossAnimation) {
                this.publicController.getStateController().setShowTossAnimation(gameModel, false);
            }

            this.appLayout.getRegion('game').$el.addClass('active');
            this.appLayout.getRegion('broker').$el.removeClass('active');
        },
        switchToBroker: function() {
            if (this.appState === 'GAME') {
                this.appLayout.getRegion('game').$el.removeClass('active');
                this.publicController.getStateController().killGame();
            }
            this.appState = 'BROKER';
            this.appLayout.getRegion('broker').$el.addClass('active');
            this.publicController.getBrokerController().reRender();
        },
        
        setPlayerReplacementState: function() {
            this.appState = 'BROKER';
            this.appLayout.getRegion('game').$el.removeClass('active');
            this.appLayout.getRegion('broker').$el.addClass('active');
            this.publicController.getBrokerController().reRender();
        },

        showLoader: function(type) {
            if (this.appState === 'GAME') {
                this.publicController.getInterfaceController().showLoader(type);
            } else {
                this.publicController.getBrokerController().showLoader();
            }
        },
        hideLoader: function() {
            if (this.appState === 'GAME') {
                this.publicController.getInterfaceController().hideLoader();
            } else {
                this.publicController.getBrokerController().hideLoader();
            }
        },
        opponentInGame: function(inGame) {
            if (this.appState === 'GAME') {
                this.publicController.getInformationTableController().opponentInGame(inGame);
            }
        },
        updateRole: function() {
            if (this.appState === 'GAME') {
                this.publicController.getPlayerActionsController().updateRole();
            }
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
            this.appState = undefined;
            this.appLayout.destroyView();
            this.publicController.destroyGame();
        },
        waitingForMove: function() {
            console.log('waiting for move');
            this.hideLoader();
        },
        waitingForTurn: function() {
            console.log('waiting for turn');
            this.showLoader('waiting');
        },
        
        getSocketRefresh: function(){
            var gameUUID = appCache.get('gameUUID');
            this.publicController.getStateController().refreshStatus(gameUUID);
        },

        killSocket: function() {
            service.killSocket();
        }
    });

    return new GameController();
});
