/*global define */

'use strict';

define([
    ], function(){
    var StatesManager = Mn.Object.extend({

        manage: function(gameModel) {
            this._manageGameState(gameModel);
            this._manageUserState(gameModel);
            this._manageUserRole(gameModel);
            this._manageOtherUserState(gameModel);
        },

        _manageUserRole: function(gameModel) {
            //Roles of a user within a game
            this.publicController.getGameController().updateRole();
        },

		_manageUserState: function(gameModel) {
            //States of a user
            var thisUser = gameModel.get('thisUser'),
                otherUser = gameModel.get('otherUser');
            switch (thisUser.state) {
                case 'UNDEFINED':

                    break;

                case 'AVAILABLE':

                    break;

                case 'INVITATION_SENT':
                    this.publicController.getGameController().waitingForTurn();
                    break;

                case 'INVITATION_RECEIVED':
                    this.publicController.getModalsController().onInvitationReceived(gameModel);
                    break;

                case 'STARTER_SELECTED':
                    if (thisUser.initiator && otherUser.state === 'STARTER_SELECTED') {
                        this.publicController.getBrokerController().lineUpShape();
                    }
                    if (otherUser.state === 'LINEUP_SELECTED') {
                        this.publicController.getBrokerController().lineUpShape('accept');
                    }
                    break;

                case 'LINEUP_SELECTED':

                    break;

                case 'INVITATON_ACCEPTED':

                    break;

                case 'IN_MOVE':

                    break;

                case 'MAKE_YOUR_MOVE':
                    this.publicController.getGameController().waitingForMove();
                    this.publicController.getStateController().checkForSecondaryMove(gameModel.toJSON(), false);
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
                    this.publicController.getGameController().switchToBroker();
                    break;
                default:

                    break;
            }
        },

        _manageOtherUserState: function(gameModel) {
            //Presence of a other user
            var otherUser = gameModel.get('otherUser');
            switch (otherUser.user.presence) {
                case 'ONLINE':
                    break;

                case 'ACTIVE':

                    break;

                case 'INACTIVE':

                    break;

                case 'OFFLINE':
                    break;

                default:

                    break;
            }
        },

        _manageGameState: function(gameModel) {
            //States of a game
            switch (gameModel.get('state')) {
                case 'UNDEFINED':
                    break;

                case 'STARTER_INVITING':

                    break;

                case 'STARTERS':

                    break;

                case 'LINEUP':

                    break;

                case 'LINEUPS_ACCEPTED':
                    this.publicController.getStateController().afterGameWasAccepted(gameModel);
                    break;

                case 'STARTING':
                    this.publicController.getGameController().switchToGame();
                    break;

                case 'RUNNING':
                    this.publicController.getGameController().switchToGame();
                    break;

                case 'PAUSED':
                    this.publicController.getModalsController().onUnpauseGame(gameModel.get('gameUUID'));
                    break;

                case 'ABANDONED':
                    this.publicController.getGameController().switchToBroker();
                    break;

                case 'COMPLETED':
                    this.publicController.getGameController().switchToBroker();
                    break;

                case 'REJECTED':
                    this.publicController.getGameController().switchToBroker();
                    break;

                default:

                    break;
            }
        }
    });

    return new StatesManager();
});
