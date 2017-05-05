/*global define */

'use strict';

define([
    '../Vent',
    '../models/user',
    '../appCache',
    '../views/gameLayout'
    ], function(Vent, userModel, appCache, GameLayout){
    var GameController = Mn.Object.extend({
            start: function(user){
                console.log('game start');

                var game = new GameLayout();
                game.render();
                this.game = game;
                
                this.createUser(user);
                console.log(user);

                this.publicController.getSocketController().start(user.uid);
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
                this.game.destroyView();
                this.publicController.destroyGame();
            },
            waitingForMove: function() {
                this.publicController.getInterfaceController().hideLoader();
            },
            waitingForTurn: function() {
                console.log('waiting for turn');
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
