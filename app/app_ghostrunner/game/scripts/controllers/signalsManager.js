/*global define */

/*
SIGNALS currently being sent:
    UNDEFINED(0, "Undefined"), //

    FORCED_LOGOUT(1, "You have been logged out"), // 
    
    YOUR_MOVE(2, "Your move"), //
    
    OPPONENT_ONLINE(3, "Opponent Online"), //
    OPPONENT_OFFLINE(4, "Opponent OffLine"),//  
    
    INVITATION_RECEIVED(5, "Invitation recieved"),//
    INVITATION_ACCEPTED(6, "Invitation accepted"),//
    
    GAME_STARTED(7, "Game started"),//
    GAME_ABANDONED(8, "Game abandoned"),//
    GAME_PAUSED(9, "Game paused"),//
    GAME_RESTARTED(10, "Game started"),
    
    GAME_OVER(11,"Game over"),
    
    YOU_WON(12,"You won!"),
    YOU_LOST(13, "You lost"),//
    
    
    BLOCK_USER(14, "Block user"), //
    SHOW_POLL(15, "Show poll"), //
    SHOW_MESSAGE(16, "Show message"), //
    REFRESH_STATE(17, "Refresh state"), //
*/

'use strict';

define([
    '../Vent'
    ], function(Vent){
    var SignalsManager = Mn.Object.extend({
    		
        });

    return new SignalsManager();
});