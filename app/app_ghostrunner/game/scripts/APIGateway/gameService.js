/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../appCache'
    ], function(gateway, appCache){
    var GameService = Mn.Object.extend({
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

        selectRemainingLineUpAndAccept: function(params) {
            var user = appCache.get('user'),
                game = appCache.get('game');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('selectRemainingLineUpAndAccept', params);
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

        selectRemainingLineUp: function(payload) {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid'),
                    payload: payload
                };
            return gateway.sendRequest('selectRemainingLineUp', params);
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

        retrieveTeamPlayers: function(team, playerType) {
            var teamUUID = team.get('teamUUID'),
                user = appCache.get('user'),
                params = {
                    teamUUID: teamUUID
                };
            if (playerType) params.type = playerType;
            if (team.get('type').enumText === 'PRIVATE') {
                params.UID = user.get('uid');
            }
            return gateway.sendRequest('retrieveTeamPlayers', params);
        },

        retrieveAvailableTeamPlayers: function() {
            var userId = appCache.get('user').get('uid'),
                gameUUID=appCache.get('game').get('gameUUID'),
                params = {
                    UID:userId,
                    gameUUID: gameUUID,
                    type:'FIELDER'
                };
            return gateway.sendRequest('retrieveAvailableTeamPlayers', params);
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

        retrievePlayerCard: function(params) {
            var user = appCache.get('user');
            params.UID = user.get('uid');
            return gateway.sendRequest('retrievePlayerCard', params);
        },

        retrievePinchHitterChoices: function() {
            var params = {};
            var user = appCache.get('user'),
                game = appCache.get('game'),
                team = Cookie.get('Team');
                params.UID = user.get('uid');
                if(team) params.teamUUID = team;
                if (game) params.gameUUID = game.get('gameUUID');
                params = params || {};
            return gateway.sendRequest('retrievePinchHitterChoices', params);
        },

        setPinchHitter: function(payload) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID'),
                    payload: payload
                };

            return gateway.sendRequest('setPinchHitter', params);
        },

        retrievePinchRunnerChoices: function() {
            var params = {};
            var user = appCache.get('user'),
                game = appCache.get('game'),
                team = Cookie.get('Team');
                params.UID = user.get('uid');
                if(team) params.teamUUID = team;
                if (game) params.gameUUID = game.get('gameUUID');
                params = params || {};
            return gateway.sendRequest('retrievePinchRunnerChoices', params);
        },

        setPinchRunner: function(payload) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID'),
                    payload: payload
                };

            return gateway.sendRequest('setPinchRunner', params);
        },

        retrieveDefensiveSubstitutionChoices: function() {
            var params = {};
            var user = appCache.get('user'),
                game = appCache.get('game'),
                team = Cookie.get('Team');
                params.UID = user.get('uid');
                if(team) params.teamUUID = team;
                if (game) params.gameUUID = game.get('gameUUID');
                params = params || {};
            return gateway.sendRequest('retrieveDefensiveSubstitutionChoices', params);
        },

        setDefensiveSubstitution: function(payload) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID'),
                    payload: payload
                };

            return gateway.sendRequest('setDefensiveSubstitution', params);
        },

        retrieveReliefPitcherChoices: function() {
            var params = {};
            var user = appCache.get('user'),
                game = appCache.get('game'),
                team = Cookie.get('Team');
                params.UID = user.get('uid');
                if(team) params.teamUUID = team;
                if (game) params.gameUUID = game.get('gameUUID');
                params = params || {};
            return gateway.sendRequest('retrieveReliefPitcherChoices', params);
        },

        setReliefPitcher: function(payload) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID'),
                    payload: payload
                };

            return gateway.sendRequest('setReliefPitcher', params);
        },

        startLineupEditing: function() {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID')
                };

            return gateway.sendRequest('startLineupEditing', params);
        },

        stopLineupEditing: function() {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID')
                };

            return gateway.sendRequest('stopLineupEditing', params);
        },

        forfeitLineupEditing: function() {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID')
                };

            return gateway.sendRequest('forfeitLineupEditing', params);
        },

        setShowTossAnimation: function(show) {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game.get('gameUUID'),
                    showTossAnimation: show
                };

            return gateway.sendRequest('setShowTossAnimation', params);
        },

        getMyLineups: function() {
            var user = appCache.get('user'),
                game = appCache.get('game'),
                params = {
                    UID: user.get('uid'),
                    gameUUID: game ? game.get('gameUUID') : null,
                };

            return gateway.sendRequest('getMyLineups', params);
        },

        createLineupAndAccept: function(params) {
            var user = appCache.get('user'),
                game = appCache.get('game');
            params = params || {};
            params.UID = user.get('uid');
            params.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('createLineupAndAccept', params);
        },

        selectRemainingLineUpById: function(params) {
            var user = appCache.get('user'),
                game = appCache.get('game');
            params = params || {};
            params.UID = user.get('uid');
            params.payload.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('selectRemainingLineUpById', params);
        },

        selectRemainingLineUpByIdAndAccept: function(params) {
            var user = appCache.get('user'),
                game = appCache.get('game');
            params = params || {};
            params.UID = user.get('uid');
            params.payload.gameUUID = game.get('gameUUID');
            return gateway.sendRequest('selectRemainingLineUpByIdAndAccept', params);
        },

        /* chat */
        getConversationBetweenUsers: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('getConversationBetweenUserUser', params);
        },

        sendMessageFromUserToUser: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('sendMessageFromUserToUser', params);
        },

        markAsReadUser: function(params) {
            var user = appCache.get('user');
            params = params || {};
            params.UID = user.get('uid');
            return gateway.sendRequest('markAsReadUser', params);
        },

        /*debug*/
        killSocket: function() {
            var user = appCache.get('user'),
                params = {
                    UID: user.get('uid')
                };

            return gateway.sendRequest('killSocket', params);
        },

    });
    return new GameService();
});
