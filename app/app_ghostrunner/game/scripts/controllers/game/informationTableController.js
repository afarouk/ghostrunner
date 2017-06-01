/*global define */

'use strict';

define([
    '../../Vent',
    '../../APIGateway/gameService',
    '../../appCache',
    '../../views/informationTable',
    '../../models/informationTable'
    ], function(Vent, service, appCache, InformationTableView, InformationTableModel){
    var InformationTableController = Mn.Object.extend({
		create: function(layout, region) {
            this.model = new InformationTableModel();
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
