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
                this.user = new userModel({
                    uid: user.uid, 
                    userName: user.userName
                });
                console.log(user);
                var game = new GameLayout();
                game.render();
            },
            stop: function(uid) {
                console.log('game stop');
                this.user.kill();
                this.user = null;
            }
        });

    return new GameController();
});
