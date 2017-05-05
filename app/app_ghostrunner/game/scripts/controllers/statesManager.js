/*global define */

/*
States of a user: (within a game)
	INVITATION_SENT
	INVITATION_RECEIVED
	INVITING

    INVITER(1,&quot;Inviter&quot;),//
    INVITEE(2, &quot;Invitee&quot;), //
    IN_GAME(3,&quot;In game&quot;),

    WAIT_FOR_TURN

Roles of a user within a game

    DUAL(1, &quot;Dual&quot;), //
    OFFENSE(2, &quot;Offense&quot;), //
    DEFENSE(3, &quot;Defense&quot;), //

Presence of a user (general)
    ONLINE(1,&quot;Online&quot;),
    ACTIVE(2, &quot;Active&quot;), //
    INACTIVE(3, &quot;InActive&quot;), //
    OFFLINE(4, &quot;OffLine&quot;), //

States of a game
	UNDEFINED(0, "Undefined"), //

	INVITING(1, "Inviting"), //
	ACCEPTED(2, "Accepted"), 
	STARTING(3, "Starting"), //

	RUNNING(4, "Running"), //

	PAUSED(5, "Paused"), //

	ABANDONED(6, "Abandoned"), //
	COMPLETED(7, "Completed"), 
	REJECTED(8, "Rejected"),;
*/



'use strict';

define([
    '../Vent'
    ], function(Vent){
    var StatesManager = Mn.Object.extend({
    		
        });

    return new StatesManager();
});