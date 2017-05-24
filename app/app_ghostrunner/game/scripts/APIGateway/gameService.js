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

        getBaseballFieldPositions: function() {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid')
                };
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

        retrieveTeamPlayers: function(team) {
            var teamId = team.get('teamId'),
                user = appCache.get('user'),
                params = {
                    teamId: teamId
                };
            if (team.get('type').enumText === 'PRIVATE') {
                params.UID = user.get('uid');
            }
            return gateway.sendRequest('retrieveTeamPlayers', params);
        },

        retrieveLineUpPlayers: function(team, lineUp) {
            var teamId = team.get('teamId'),
                lineUpId = lineUp.lineUpId,
                user = appCache.get('user'),
                params = {
                    teamId: teamId,
                    lineUpId: lineUpId
                };
            if (team.get('type').enumText === 'PRIVATE') {
                params.UID = user.get('uid');
            }
            return gateway.sendRequest('retrieveLineUpPlayers', params);
        },

        createTeam: function(teamData) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    payload: teamData
                };
            return gateway.sendRequest('createTeam', params);
        },
        createLineup: function(lineUpData, teamUUID) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    teamUUID: teamUUID,
                    payload: lineUpData
                };
            return gateway.sendRequest('createLineUp', params);
        },
        deleteTeam: function(teamUUID) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    teamUUID: teamUUID
                };
            return gateway.sendRequest('deleteTeam', params);
        },
        deleteLineUp: function(teamUUID, lineUpId) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    teamUUID: teamUUID,
                    lineUpId: lineUpId
                };
            return gateway.sendRequest('deleteLineUp', params);
        },
    });

    return new GameService();
});
