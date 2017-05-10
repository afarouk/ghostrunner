/*global define */

'use strict';

define([
    '../../Vent',
    '../../models/user',
    '../../appCache',
    '../../views/appLayout'
    ], function(Vent, userModel, appCache, AppLayout){
    var GameController = Mn.Object.extend({
        start: function(user){
            console.log('game start');

            var appLayout = new AppLayout();
            appLayout.render();
            this.appLayout = appLayout;
            
            this.createUser(user);
            console.log(user);

            this.publicController.getSocketController().start(user.uid);
        },
        showGame: function() {
            this.appLayout.getRegion('game').$el.show();
        },
        hideGame: function() {
            this.appLayout.getRegion('game').$el.hide();
        },
        showBroker: function() {
            this.appLayout.getRegion('broker').$el.show();
        },
        hideBroker: function() {
            this.appLayout.getRegion('broker').$el.show();
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
                other = game.get('otherUser').userName,
                gameName = game.get('gameName');
            this.publicController.getPlayerChoiceController().showConfirmation({
                message: other + ' sent you invitation to '+ gameName + '<br> accept invitation?',
                cancel: 'cancel',
                confirm: 'ok'
            }).then(function(){
                this.publicController.getStateController().onInvitationAccepted();
            }.bind(this), function() {
                //TODO something
                this.publicController.getStateController().onInvitationRejected(game);
            }.bind(this));
            console.log('invitation received');
        },

        onAvailableForNewGame: function() {
            this.publicController.getPlayerChoiceController().showConfirmation({
                message: 'start new game?',
                cancel: 'cancel',
                confirm: 'ok'
            }).then(function(){
                console.log('start new game');
                this.publicController.getStateController().onGetAvailableUsers();
            }.bind(this), function() {
                console.log('......');
            }.bind(this));
        }
    });

    return new GameController();
});
