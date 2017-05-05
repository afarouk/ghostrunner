/*global define */

/*
States of a user: (within a game)
	UNDEFINED(0, "Undefined"), //
	AVAILABLE(1,"Available"),

	INVITATION_SENT(2,"Invitation sent"),
	INVITATION_RECEIVED(3,"Invitation received"),//

	IN_MOVE(4,"In move"),
	MAKE_YOUR_MOVE(5, "Your turn"), //
	WAIT_FOR_TURN(6, "Wait for turn"), //

	ANSWER_POLL(7, "Answer query"), //
	SEE_MESSAGE(8, "See message"), //

	WAIT_FOR_SYSTEM(9, "Wait "),

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
    		manageState: function(gameModel) {
                var thisUser = gameModel.get('thisUser');
                switch (thisUser.state) {
                    case 'MAKE_YOUR_MOVE':
                        this.publicController.getGameController().waitingForMove();
                        break;
                    case 'WAIT_FOR_TURN':
                        this.publicController.getGameController().waitingForTurn();
                        break;
                    case 'INVITATION_RECEIVED':
                        this.publicController.getGameController().onInvitationReceived();
                        break;
                    case 'INVITATION_SENT':
                        //TODO something???
                        break;
                    case 'AVAILABLE':
                        if (gameModel.get('state') === 'COMPLETE') {
                            this.publicController.getGameController().onAvailableForNewGame();
                        }
                        break;
                    case 'ABANDONED':
                        this.publicController.getGameBtnController().hideAbandonBtn();
                        this.publicController.getGameBtnController().removeGameUUID();
                        break;
                    default:
                        //TODO default???
                        //this.publicController.getGameController().waitingForMove();
                        break;
                }
            },
        });

    return new StatesManager();
});