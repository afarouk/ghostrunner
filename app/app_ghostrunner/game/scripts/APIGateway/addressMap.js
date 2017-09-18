/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
        	getGame: ['GET', '/gaming/getGame'],
            startGame: ['PUT', '/gaming/startGame'],
            refresh: ['GET', '/gaming/refresh'],
            notifyOpponentOfGameResumption: ['PUT', '/gaming/notifyOpponentOfGameResumption'],
            pauseGame: ['PUT', '/gaming/pauseGame'],
            unPauseGame: ['PUT', '/gaming/unPauseGame'],
            abandonGame: ['PUT', '/gaming/abandonGame'],

            makeMove: ['POST', '/gaming/makeMove'],
            makeSecondaryMove: ['POST', '/gaming/makeSecondaryMove'],
            setShowTossAnimation: ['PUT', '/gaming/setShowTossAnimation'],
            retrievePlayerCard: ['GET', '/gaming/retrievePlayerCard'],

            rejectInvitation: ['PUT', '/gaming/rejectInvitation'],
        	selectRemainingLineUpAndAccept: ['PUT', '/gaming/selectRemainingLineUpAndAccept'],
        	selectStarterAndInvite: ['PUT', '/gaming/selectStarterAndInvite'],
            selectStarterAndInviteAndRegister: ['PUT', '/gaming/selectStarterAndInviteAndRegister'],


        	getAvailableUsers: ['GET', '/gaming/getAvailableUsers'],
            selectStarter: ['PUT', '/gaming/selectStarter'],
            selectRemainingLineUp: ['PUT', '/gaming/selectRemainingLineUp'],

            getMyRunningGame: ['GET', '/gaming/getMyRunningGame'],
            getMyInvitations: ['GET', '/gaming/getMyInvitations'],
        	getMyGames: ['GET', '/gaming/getMyGames'],
            getTeams: ['GET', '/gaming/getMyTeams'],

            getMyLineups: ['GET', '/gaming/getMyLineups'],
            selectLineupAndInvite: ['PUT', '/gaming/selectLineupAndInvite'],
            selectLineupAndInviteAndRegister: ['PUT', '/gaming/selectLineupAndInviteAndRegister'],
            selectLineupAndAccept: ['PUT', '/gaming/selectLineupAndAccept'],
            createLineupAndAccept: ['PUT', '/gaming/createLineupAndAccept'],
            selectRemainingLineUpAndStart: ['PUT', '/gaming/selectRemainingLineUpAndStart'], //???

            getAvailablePlayers: ['GET', '/gaming/getAvailablePlayers'],
            retrieveAvailablePlayers: ['GET', '/gaming/retrieveAvailablePlayers'],
            retrieveTeamPlayers: ['GET', '/gaming/retrieveTeamPlayers'],
            retrieveAvailableTeamPlayers: ['GET', '/gaming/retrieveAvailableTeamPlayers'],
            retrieveLineUpPlayers: ['GET', '/gaming/retrieveLineUpPlayers'],
            createTeam: ['POST', '/gaming/createTeam'],
            createLineUp: ['POST', '/gaming/createLineUp'],
            deleteTeam: ['DELETE', '/gaming/deleteTeam'],
            deleteLineUp: ['DELETE', '/gaming/deleteLineUp'],

            //player replacement
            retrievePinchHitterChoices: ['GET', '/gaming/retrievePinchHitterChoices'],
            setPinchHitter: ['POST', '/gaming/setPinchHitter'],
            retrievePinchRunnerChoices: ['GET', '/gaming/retrievePinchRunnerChoices'],
            setPinchRunner: ['POST', '/gaming/setPinchRunner'],
            retrieveDefensiveSubstitutionChoices: ['GET', '/gaming/retrieveDefensiveSubstitutionChoices'],
            setDefensiveSubstitution: ['POST', '/gaming/setDefensiveSubstitution'],
            retrieveReliefPitcherChoices: ['GET', '/gaming/retrieveReliefPitcherChoices'],
            setReliefPitcher: ['POST', '/gaming/setReliefPitcher'],

            startLineupEditing: ['PUT', '/gaming/startLineupEditing'],
            stopLineupEditing: ['PUT', '/gaming/stopLineupEditing'],
            forfeitLineupEditing: ['PUT', '/gaming/forfeitLineupEditing'],

            // getMessage: ['GET', '/gaming/getMessage'],
            // getPoll: ['GET', '/gaming'],

            /*debug*/
            killSocket: ['GET', '/gaming/killSocket'],
        };
    }
};
