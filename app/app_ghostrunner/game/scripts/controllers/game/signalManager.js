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
                    this.publicController.getGameBtnController().opponentInGame(false);
                    break;

                case 'OPPONENT_ONLINE':
                    this.publicController.getGameBtnController().opponentInGame(true);
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
                    this.publicController.getGameController().onRejectedByOponnent();
                    break;

                case 'GAME_STARTED':

                    break;

                case 'GAME_ABANDONED':
                    this.publicController.getGameController().onAbandonedByOponnent();
                    break;

                case 'GAME_PAUSED':
                    this.publicController.getGameController().onPausedByOponnent();
                    break;

                case 'GAME_RESTARTED':
                    this.publicController.getGameController().switchToBroker();
                    break;

                case 'GAME_OVER':
                    //TODO show game over modal
                    this.publicController.getGameController().onGameOver();
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
