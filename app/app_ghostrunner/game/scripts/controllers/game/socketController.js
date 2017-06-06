/*global define */

'use strict';

define([
    '../../models/user',
    '../../APIGateway/socket-connect'
    ], function(userModel, SocketConnect){
    var SocketController = Mn.Object.extend({
        start: function(user){
            this.connector = new SocketConnect(user);
            this.listenTo(this.connector, 'updateStatus', this.updateStatus, this);
            this.listenTo(this.connector, 'onMessage', this.onMessage, this);
        },
        onBeforeDestroy: function(){
            this.stopListening();
            this.connector.destroy();
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
            this.publicController.getSignalManager().onMessage(message);
        }

    });

    return new SocketController();
});
