/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../appCache'
    ], function(gateway, appCache){
    var GameService = Mn.Object.extend({
        getGameUser: function() {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid')
                };
            return gateway.sendRequest('getGameUser', params);
        },
        getGame: function() {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid')
                };
            if (game) params.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('getGame', params);
        },
        makeMove: function(params) {
            var user = appCache.get('user'),
                game = appCache.get('game');
            params = params || {};
            params.UID = user.get('uid');
            if (game) params.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('makeMove', params);
        },
        retrieveInvitation: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('retrieveInvitation', params);
        },
        acceptInvitation: function(params) {
            var user = appCache.get('user'),
                game = appCache.get('game');
            params = params || {};
            params.UID = user.get('uid');
            if (game) params.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('acceptInvitation', params);
        },
        sendInvitation: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('sendInvitation', params);
        },
        getAvailableUsers: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getAvailableUsers', params);
        },
        resetGame: function() {
            return gateway.sendRequest('resetGame');
        }
    });

    return new GameService();
});
