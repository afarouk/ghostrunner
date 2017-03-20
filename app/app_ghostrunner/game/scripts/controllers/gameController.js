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
                console.log('invitation received');
                var accept = confirm('accept invitation?');
                if (accept) {
                    this.publicController.getStateController().onInvitationAccepted();
                } else {
                    //TODO rejected
                }
            }
        });

    return new GameController();
});
