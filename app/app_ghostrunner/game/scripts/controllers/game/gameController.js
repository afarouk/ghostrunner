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
        switchToGame: function() {
            this.appLayout.getRegion('game').$el.addClass('active');
            this.appLayout.getRegion('broker').$el.removeClass('active');
            this.publicController.getGameBtnController().showGameBtns();
        },
        switchToBroker: function() {
            this.appLayout.getRegion('game').$el.removeClass('active');
            this.appLayout.getRegion('broker').$el.addClass('active');
            this.publicController.getBrokerController().reRender();
            this.publicController.getGameBtnController().hideGameBtns();
            this.publicController.getStateController().killGame();
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
        }
    });

    return new GameController();
});
