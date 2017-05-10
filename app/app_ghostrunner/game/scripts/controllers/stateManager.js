/*global define */

/*
Roles of a user within a game

    DUAL(1, &quot;Dual&quot;), //
    OFFENSE(2, &quot;Offense&quot;), //
    DEFENSE(3, &quot;Defense&quot;), //

Presence of a user (general)
    ONLINE(1,&quot;Online&quot;),
    ACTIVE(2, &quot;Active&quot;), //
    INACTIVE(3, &quot;InActive&quot;), //
    OFFLINE(4, &quot;OffLine&quot;), //
*/



'use strict';

define([
    '../Vent'
    ], function(Vent){
    var StatesManager = Mn.Object.extend({
    		manageUserState: function(gameModel) {
                this.manageGameState(gameModel); //todo make that part smarter
                //States of a user
                var thisUser = gameModel.get('thisUser');
                switch (thisUser.state) {
                    case 'UNDEFINED':

                        break;

                    case 'AVAILABLE':
                        // if (gameModel.get('state') === 'COMPLETED') {
                        //     this.publicController.getGameController().onAvailableForNewGame();
                        // }
                        this.manageGameState(gameModel);
                        break;

                    case 'INVITATION_SENT':
                        //TODO something???
                        this.publicController.getGameController().waitingForTurn();
                        break;

                    case 'INVITATION_RECEIVED':
                        this.publicController.getGameController().onInvitationReceived();
                        break;

                    case 'IN_MOVE':

                        break;

                    case 'MAKE_YOUR_MOVE':
                        this.publicController.getGameController().waitingForMove();
                        break;
                    case 'WAIT_FOR_TURN':
                        this.publicController.getGameController().waitingForTurn();
                        break;

                    case 'ANSWER_POLL':

                        break;

                    case 'SEE_MESSAGE':

                        break;

                    case 'WAIT_FOR_SYSTEM':

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

            manageGameState: function(gameModel) {
                //States of a game
                switch (gameModel.get('state')) {
                    case 'UNDEFINED':

                        break;

                    case 'INVITING':
                        
                        break;

                    case 'ACCEPTED':
                        this.publicController.getStateController().startGame(gameModel.get('gameUUID'));
                        break;

                    case 'STARTING':
                        
                        break;

                    case 'RUNNING':

                        break;

                    case 'PAUSED':

                        break;

                    case 'ABANDONED':

                        break;

                    case 'COMPLETED':
                        this.publicController.getGameController().onAvailableForNewGame();
                        break;

                    case 'REJECTED':

                        break;

                    default:

                        break;
                }
            }
        });

    return new StatesManager();
});