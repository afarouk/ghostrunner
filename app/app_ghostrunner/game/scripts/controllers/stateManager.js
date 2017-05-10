/*global define */

'use strict';

define([
    '../Vent'
    ], function(Vent){
    var StatesManager = Mn.Object.extend({

            manage: function(gameModel) {
                this._manageGameState(gameModel);
                this._manageUserState(gameModel);
                this._manageOtherUserState(gameModel);
            },

            _manageUserRole: function(role) {
                //Roles of a user within a game

                switch (role) {
                    case 'DUAL':

                        break;

                    case 'OFFENSE':

                        break;

                    case 'DEFENSE':

                        break;

                    default:

                        break;
                }
            },

    		_manageUserState: function(gameModel) {
                //States of a user
                var thisUser = gameModel.get('thisUser');
                switch (thisUser.state) {
                    case 'UNDEFINED':

                        break;

                    case 'AVAILABLE':
                        
                        break;

                    case 'INVITATION_SENT':
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
                        
                        break;
                }
            },

            _manageOtherUserState: function(gameModel) {
                //Presence of a other user
                var otherUser = gameModel.get('otherUser');
                switch (otherUser.user.presence) {
                    case 'ONLINE':
                        this.publicController.getInformationTableController().opponentInGame(true);
                        break;

                    case 'ACTIVE':
                        
                        break;

                    case 'INACTIVE':
                        
                        break;

                    case 'OFFLINE':
                        this.publicController.getInformationTableController().opponentInGame(false);
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