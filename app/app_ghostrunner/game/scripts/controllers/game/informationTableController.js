/*global define */

'use strict';

define([
    '../../APIGateway/gameService',
    '../../appCache',
    '../../views/informationTable'
    ], function(service, appCache, InformationTableView){
    var InformationTableController = Mn.Object.extend({
		create: function(layout, region) {
            this.model = appCache.get('game');
			this.view = new InformationTableView({
                model: this.model
            });
			layout.showChildView( region, this.view );
		},
        onBeforeDestroy: function(){
            this.stopListening();
        },
        opponentInGame: function(inGame) {
            if (inGame) {
                this.view.ui.opponentStatus
                    .addClass('online').removeClass('offline');
            } else {
                this.view.ui.opponentStatus
                    .addClass('offline').removeClass('onfline');
            }
        },

        clickAbandonBtn : function(){
            this.publicController.getModalsController().onAbandoneGame();
        },

        clickPauseBtn: function() {
            this.publicController.getModalsController().onPauseGameConfirmation();
        }
    });

    return new InformationTableController();
});
