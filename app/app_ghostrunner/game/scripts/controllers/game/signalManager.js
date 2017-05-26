/*global define */

'use strict';

define([
    '../../Vent'
    ], function(Vent){
    var SignalsManager = Mn.Object.extend({
		onMessage: function(message) {
            switch (message.signal) {
                case 'Undefined':
                    break;

                case 'FORCED_LOGOUT':
                    break;

                case 'YOUR_MOVE':
                    this.publicController.getGameController().waitingForMove();
                    break;

                case 'OPPONENT_OFFLINE':
                    this.publicController.getInformationTableController().opponentInGame(false);
                    break;

                case 'OPPONENT_ONLINE':
                    this.publicController.getInformationTableController().opponentInGame(true);
                    break;

                case 'INVITATION_RECEIVED':
                    this.publicController.getStateController().onRetrieveInvitation(message);
                    break;

                case 'INVITATION_ACCEPTED':
                    this.publicController.getStateController().refreshStatus(message.gameUUID);
                    break;

                case 'INVITATION_REJECTED':
                    /* TODO  Show informational popup only */
                    console.log(" Received invitation rejected signal ");
                    this.publicController.getModalsController().onRejectedByOponnent(message);
                    break;

                case 'GAME_STARTED':
                    this.publicController.getStateController().refreshStatus(message.gameUUID);
                    break;

                case 'GAME_ABANDONED':
                    this.publicController.getModalsController().onAbandonedByOponnent();
                    break;

                case 'GAME_PAUSED':
                    this.publicController.getModalsController().onPausedByOponnent();
                    break;

                case 'GAME_RESTARTED':
                    this.publicController.getGameController().switchToBroker();
                    break;

                case 'GAME_OVER':
                    this.publicController.getModalsController().onGameOver();
                    break;

                case 'YOU_WON':

                    break;

                case 'YOU_LOST':

                    break;

                case 'BLOCK_USER':

                    break;

                case 'SHOW_POLL':

                    break;

                case 'SHOW_MESSAGE':

                    break;

                case 'REFRESH_STATE':
                    this.publicController.getStateController().refreshStatus();
                    break;

                default:
                    break;
            }
        }
    });

    return new SignalsManager();
});
