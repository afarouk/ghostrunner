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
                
                this.createUser(user);
                console.log(user);

                this.publicController.getSocketController().connect(user.uid);
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
                // this.publicController.getStateController().onGameStop();
            },
            waitingForMove: function() {
                this.publicController.getInterfaceController().hideLoader();
            },
            waitingForTurn: function() {
                console.log('waiting for turn');
            }
        });

    return new GameController();
});
