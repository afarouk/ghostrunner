/*global define */

'use strict';

define([
    '../models/user',
    '../appCache',
    '../APIGateway/gameService',
    '../views/appLayout'
    ], function(userModel, appCache, service, AppLayout){
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
        switchToGame: function() {
            this.appState = 'GAME';
            this.appLayout.renderGame();
            this.appLayout.getRegion('game').$el.addClass('active');
            this.appLayout.getRegion('broker').$el.removeClass('active');
        },
        switchToBroker: function() {
            if (this.appState === 'GAME') {
                this.appLayout.getRegion('game').$el.removeClass('active');
            }
            this.appState = 'BROKER';
            this.appLayout.getRegion('broker').$el.addClass('active');
            this.publicController.getBrokerController().reRender();
        },
        showLoader: function() {
            if (this.appState === 'GAME') {
                this.publicController.getInterfaceController().showLoader();
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
            console.log('waiting for move');
            this.hideLoader();
        },
        waitingForTurn: function() {
            console.log('waiting for turn');
            this.showLoader();
        }
    });

    return new GameController();
});
