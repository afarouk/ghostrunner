/*global define */

'use strict';

define([
    '../Vent'
    ], function(Vent){
    var SignalsManager = Mn.Object.extend({
    		onMessage: function(signal) {
                switch (signal) {
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
                        this.publicController.getStateController().onRetrieveInvitation();
                        break;

                    case 'INVITATION_ACCEPTED':
                        this.publicController.getStateController().refreshStatus();
                        break;

                    case 'GAME_STARTED':
                        
                        break;

                    case 'GAME_ABANDONED':
                        this.publicController.getGameBtnController().hideGameBtns();
                        this.publicController.getGameBtnController().removeGameUUID();
                        this.publicController.getStateController().refreshStatus();
                        break;

                    case 'GAME_PAUSED':
                        
                        break;

                    case 'GAME_RESTARTED':
                        
                        break;

                    case 'GAME_OVER':
                        this.publicController.getStateController().refreshStatus();
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