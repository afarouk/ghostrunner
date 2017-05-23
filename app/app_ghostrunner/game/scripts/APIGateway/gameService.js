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
        startGame: function(gameUUID, role) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: gameUUID,
                    preferredRole: role
                };
            return gateway.sendRequest('startGame', params);
        },
        pauseGame: function() {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {};
            params.UID = user.get('uid');
            if (game) params.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('pauseGame', params);
        },
        unPauseGame: function(gameUUID) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    gameUUID: gameUUID,
                    UID: user.get('uid')
                };
            if (game) params.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('unPauseGame', params);
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
        sendInvitationAndRegister: function(params) {
            var user = appCache.get('user');
            params.UID = user.get('uid');
            params.payload = {
                email: params.email
            };
            delete params.email;
            return gateway.sendRequest('sendInvitationAndRegister', params);
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
        abandonGame : function(){
            var user = appCache.get('user'),
                game = appCache.get('game'),
            params = params || {};
            params.UID = user.get('uid');
            if(game){
             params.gameUUID = game.get('gameUUID');   
            }
            return gateway.sendRequest('abandonGame',params);
        },

        //teams part
        tempData: function(def) {//temporary
            var data = [
                [
                    {
                        displayText: 'position1',
                        enumText: 'POSITION1'
                    },
                    {
                        displayText: 'position2',
                        enumText: 'POSITION2'
                    }
                ]
            ];
            setTimeout(function(){
                def.resolve(data);
            }, 1);
        },
        getBaseballFieldPositions: function() {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid')
                };
            //temporary
            var def = $.Deferred();
            this.tempData(def);
            return def;
            //.........
            return gateway.sendRequest('getBaseballFieldPositions', params);
        },

        getTeams: function() {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid')
                };
            return gateway.sendRequest('getTeams', params);
        },

        retrieveAvailablePlayers: function() {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid')
                };
            return gateway.sendRequest('retrieveAvailablePlayers', params);
        },

        retrieveTeamPlayers: function(teamId) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    teamId: teamId
                };
            return gateway.sendRequest('retrieveTeamPlayers', params);
        },

        createTeam: function(teamData) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    payload: teamData
                };
            return gateway.sendRequest('createTeam', params);
        },
        createLineup: function(lineUpData) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    payload: lineUpData
                };
            return gateway.sendRequest('createLineup', params);
        }
    });

    return new GameService();
});
