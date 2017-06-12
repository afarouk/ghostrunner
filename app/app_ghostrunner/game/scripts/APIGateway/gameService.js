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
        notifyOpponentOfGameResumption: function(gameUUID) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {};
            params.UID = user.get('uid');
            if (gameUUID) {
                params.gameUUID = gameUUID;
            } else if (game) {
                params.gameUUID = game.get('gameUUID');
            }
            return gateway.sendRequest('notifyOpponentOfGameResumption', params);
        },
        pauseGame: function(gameUUID) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {};
            params.UID = user.get('uid');
            if (gameUUID) {
                params.gameUUID = gameUUID;
            } else if (game) {
                params.gameUUID = game.get('gameUUID');
            }
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
        makeSecondaryMove: function(params) {
            var user = appCache.get('user'),
                game = appCache.get('game');
            params.UID = user.get('uid');
            params.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('makeSecondaryMove', params);
        },
        retrieveInvitation: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('retrieveInvitation', params);
        },
        selectLineUpAndAccept: function(params) {
            var user = appCache.get('user'),
                game = appCache.get('game');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('selectLineUpAndAccept', params);
        },
        rejectInvitation: function(game) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID')
                };
            return gateway.sendRequest('rejectInvitation', params);
        },
        selectStarterAndInvite: function(payload) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    payload: payload
                };
            return gateway.sendRequest('selectStarterAndInvite', params);
        },
        selectStarterAndInviteAndRegister: function(payload) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    payload: payload
                };
            return gateway.sendRequest('selectStarterAndInviteAndRegister', params);
        },
        selectStarter: function(payload) {
            var game = appCache.get('game'),
                user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    payload: payload
                };
            if (game) params.payload.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('selectStarter', params);
        },
        selectLineUp: function(payload) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    payload: payload
                };
            return gateway.sendRequest('selectLineUp', params);
        },
        getAvailableUsers: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getAvailableUsers', params);
        },
        getMyInvitations: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getMyInvitations', params);
        },
        getMyGames: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getMyGames', params);
        },
        getMyRunningGame: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getMyRunningGame', params);
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
            var teamUUID = team.get('teamUUID'),
                user = appCache.get('user'),
                params = {
                    teamUUID: teamUUID
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
