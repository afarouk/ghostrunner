/*global define */

'use strict';

define([
    '../Vent',
    '../models/user',
    '../views/gameLayout'
    ], function(Vent, userModel, GameLayout){
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
                // user.kill();
                // user = null;
            },
            waitingForMove: function() {
                this.publicController.getInterfaceController().showInterface();
            },
            waitingForTurn: function() {
                console.log('waiting for turn');
            }
        });

    return new GameController();
});
