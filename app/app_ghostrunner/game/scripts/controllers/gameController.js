/*global define */

'use strict';

define([
    '../Vent',
    '../models/user',
    '../views/gameLayout',
    '../APIGateway/socket-connect'
    ], function(Vent, userModel, GameLayout, SocketConnect){
    var GameController = Mn.Object.extend({
            start: function(user){
                console.log('game start');
                this.user = new userModel({
                    uid: user.uid, 
                    userName: user.userName
                });

                //TODO maybe when we don't have user we should 
                // connect as anonymous
                //in that case we should open connection 
                // before login ???
                var connect = new SocketConnect(user.uid);
                // ..........websockets

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
