/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getGameUser: ['GET', '/gaming/getGameUser'],
        	getGame: ['GET', '/gaming/getGame'],
        	makeMove: ['POST', '/gaming/makeMove'],
        	resetGame: ['GET', '/gaming/reset'],
        	retrieveInvitation: ['GET', '/gaming/retrieveInvitation'],
        	acceptInvitation: ['PUT', '/gaming/acceptInvitation'],
        	sendInvitation: ['PUT', '/gaming/sendInvitation'],
        	getAvailableUsers: ['GET', '/gaming/getAvailableUsers']
        };
    }
};
