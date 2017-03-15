/*global define */

'use strict';

define([
    '../Vent',
    '../models/user',
    '../APIGateway/socket-connect'
    ], function(Vent, userModel, SocketConnect){
    var SocketController = Mn.Object.extend({
            connect: function(user){
                var connect = new SocketConnect(user);
                this.listenTo(connect, 'updateStatus', this.updateStatus, this);
                this.listenTo(connect, 'onMessage', this.onMessage, this);
            },
            updateStatus: function(status) {
                switch (status) {
                    case 'Connected':
                        this.publicController.getStateController().onGameStart();
                        break;
                    case 'Disconnected':
                        this.publicController.getStateController().onGameStop();
                        break;
                }
            },
            stop: function() {

            },

            onMessage: function(message) {
                console.log(message);
                this.publicController.getStateController().onMessage(message.signal);
            }

        });

    return new SocketController();
});
