/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../appCache'
    ], function(gateway, appCache){
    var GameService = Mn.Object.extend({
        getGame: function() {
            var user = appCache.get('user');
            return gateway.sendRequest('getGame', {
                UID: user.get('uid')
            })
        },
        makeMove: function() {
            var user = appCache.get('user');
            return gateway.sendRequest('makeMove', {
                UID: user.get('uid')
            })
        },
        stopGame: function() {
            return gateway.sendRequest('stopGame');
        }
    });

    return new GameService();
});
