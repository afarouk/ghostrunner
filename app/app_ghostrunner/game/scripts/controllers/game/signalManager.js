/*global define */

'use strict';

define([
    ], function(){
    var SignalsManager = Mn.Object.extend({
	onMessage: function(message) {
            this.check = false;
            switch (message.signal) {
                case 'Undefined':
                    break;

                case 'FORCED_LOGOUT':
                    this.publicController.getStateController().onForceLogout();
                    break;

                case 'YOUR_MOVE':
                    this.publicController.getGameController().waitingForMove();
                    break;

                case 'OPPONENT_OFFLINE':
                    this.publicController.getGameController().opponentInGame(false);
                    break;

                case 'OPPONENT_ONLINE':
                    this.publicController.getGameController().opponentInGame(true);
                    break;

                case 'INVITATION_RECEIVED':
                    this.publicController.getStateController().onRetrieveInvitation(message);
                    break;

                case 'STARTER_SELECTED':
                    this.publicController.getStateController().beforeRefreshStatus(message);
                    break;

                case 'LINEUP_SELECTED':
                    this.publicController.getStateController().beforeRefreshStatus(message);
                    break;

                case 'LINEUP_EDITED':
                    this.publicController.getModalsController().onLineUpEditConfirmation(message.gameUUID);
                    break;

                case 'INVITATION_ACCEPTED':
                    this.publicController.getStateController().refreshStatus(message.gameUUID);
                    break;

                case 'INVITATION_REJECTED':
                    this.publicController.getModalsController().onRejectedByOponnent(message);
                    break;

                case 'GAME_STARTED':
                    this.publicController.getModalsController().onStartGameConfirmation(message.gameUUID);
                    break;

                case 'GAME_ABANDONED':
                    this.publicController.getModalsController().onAbandonedByOponnent();
                    break;

                case 'GAME_PAUSED':
                    this.publicController.getModalsController().onPausedByOponnent();
                    break;

                case 'GAME_UNPAUSED':
                    this.publicController.getModalsController().onStartGameConfirmation(message.gameUUID);
                    break;

                case 'GAME_RESTARTED':
                    this.publicController.getStateController().onCheckRestart(message.gameUUID);
                    break;

                case 'GAME_INNING_OVER':
                    this.publicController.getModalsController().onInningOver(message.gameUUID);
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
                    this.publicController.getStateController().refreshStatus(message.gameUUID);
                    if(this.check == false) {    
                        this.check = true;
                        var test = this.publicController.getModalsController().refreshGamePopup();
                        if(test) {
                           this.check = false;
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    });

    return new SignalsManager();
});
