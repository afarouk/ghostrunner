/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getGameUser: ['GET', '/gaming/getGameUser'],
        	getGame: ['GET', '/gaming/getGame'],
        	makeMove: ['POST', '/gaming/makeMove'],
            startGame: ['PUT', '/gaming/startGame'],
            notifyOpponentOfGameResumption: ['PUT', '/gaming/notifyOpponentOfGameResumption'],
            pauseGame: ['PUT', '/gaming/pauseGame'],
            unPauseGame: ['PUT', '/gaming/unPauseGame'],
            updateGamePresence: ['PUT', '/gaming/updateGamePresence'],
        	retrieveInvitation: ['GET', '/gaming/retrieveInvitation'],
            rejectInvitation: ['PUT', '/gaming/rejectInvitation'],
        	selectLineUpAndAccept: ['PUT', '/gaming/selectLineUpAndAccept'],
        	selectStarterAndInvite: ['PUT', '/gaming/selectStarterAndInvite'],
            selectStarterAndInviteAndRegister: ['PUT', '/gaming/selectStarterAndInviteAndRegister'],
        	getAvailableUsers: ['GET', '/gaming/getAvailableUsers'],
            selectStarter: ['PUT', '/gaming/selectStarter'],
            selectLineUp: ['PUT', '/gaming/selectLineUp'],
        	abandonGame: ['PUT', '/gaming/abandonGame'],
        	getMyGames: ['GET', '/gaming/getMyGames'],
            getMyRunningGame: ['GET', '/gaming/getMyRunnningGame'],
            getTeams: ['GET', '/gaming/getMyTeams'],
            retrieveAvailablePlayers: ['GET', '/gaming/retrieveAvailablePlayers'],
            retrieveTeamPlayers: ['GET', '/gaming/retrieveTeamPlayers'],
            retrieveLineUpPlayers: ['GET', '/gaming/retrieveLineUpPlayers'],
            createTeam: ['POST', '/gaming/createTeam'],
            createLineUp: ['POST', '/gaming/createLineUp'],
            deleteTeam: ['DELETE', '/gaming/deleteTeam'],
            deleteLineUp: ['DELETE', '/gaming/deleteLineUp'],
            getBaseballFieldPositions: ['GET', '/gaming/getBaseballFieldPositions'],
            getMessage: ['GET', '/gaming/getMessage'],
            getPoll: ['GET', '/gaming'],
            getAvailablePlayers: ['GET', '/gaming/getAvailablePlayers']
        };
    }
};
