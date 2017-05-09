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
        getGame: function(gameUUID) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid')
                };
            if (game) params.gameUUID = game.get('gameUUID');
            if (gameUUID) params.gameUUID = gameUUID;
            return gateway.sendRequest('getGame', params);
        },
        startGame: function(gameUUID) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: gameUUID
                };
            return gateway.sendRequest('startGame', params);
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
        rejectInvitation: function(game) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID')
                };
            return gateway.sendRequest('rejectInvitation', params);
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
        getMyGames: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getMyGames', params);
        },
        resetGame: function() {
            return gateway.sendRequest('resetGame');
        },
        abandonGame : function(){
            var user = appCache.get('user'),
                game = appCache.get('game'),
            params = params || {};
            params.UID = user.get('uid');
            if(game){
             params.gameUUID = game.get('gameUUID');   
            }
            return gateway.sendRequest('abandonGame',params);
        }
    });

    return new GameService();
});
