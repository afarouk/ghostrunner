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
        //TODO show interface
        //depending on model
		create: function(layout, region) {
            this.model = new InformationTableModel;
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
            this.publicController.getInterfaceController().showLoader();
            var game = appCache.get('game');

            service.pauseGame()
                .then(function(status){
                    this.publicController.getInterfaceController().hideLoader();
                    this.publicController.getGameController().switchToBroker();
                    this.publicController.getStateController().onGameStop();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(err){
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
        }
    });

    return new InformationTableController();
});
