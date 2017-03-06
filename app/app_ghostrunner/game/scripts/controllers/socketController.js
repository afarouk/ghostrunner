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
            },
            updateStatus: function(status) {
                switch (status) {
                    case 'Connected':
                    this.publicController.getStateController().start();
                    break;
                }
            },
            stop: function() {

            }
        });

    return new SocketController();
});
