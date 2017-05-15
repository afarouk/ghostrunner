/*global define */

'use strict';

define([
    '../../Vent',
    '../../views/partials/gameBtn',
    '../../APIGateway/gameService',
    '../../appCache',
    '../../models/topButtons'
    ], function(Vent, GameBtnView, service, appCache, TopButtonsModel){
    var GameBtnController = Mn.Object.extend({
        create: function(layout, region) {
            this.model = new TopButtonsModel();
            this.view = new GameBtnView({
                model: this.model
            });
            layout.showChildView( region, this.view );
        },

        opponentInGame: function(inGame) {
            this.model.set('opponentInGame', inGame);
        },

        showGameBtns: function() {
            this.view.triggerMethod('showGameBtns');
            this.updateState();
        },

        hideGameBtns: function() {
            this.view.triggerMethod('hideGameBtns');
        },

        updateState: function() {
            var game = appCache.get('game');
            this.view.triggerMethod('updateState', game.get('state'));
        },

        clickAbandonBtn : function(){
            this.publicController.getGameController().onAbandoneGame();
        },

        clickPauseBtn: function() {
            this.publicController.getInterfaceController().showLoader();
            var game = appCache.get('game');

            if (game.get('state') != 'PAUSED') {
                service.pauseGame()
                    .then(function(status){
                        this.publicController.getInterfaceController().hideLoader();
                        this.publicController.getStateController().refreshStatus(game.get('gameUUID'));
                    }
                    .bind(this), function(err){
                        this.publicController.getInterfaceController().hideLoader();
                    }.bind(this));
            } else {
                service.unPauseGame()
                    .then(function(status){
                        this.publicController.getInterfaceController().hideLoader();
                        this.publicController.getStateController().refreshStatus();
                    }
                    .bind(this), function(err){
                        this.publicController.getInterfaceController().hideLoader();
                    }.bind(this));
            }
        },
        removeGameUUID:function(){
            var game= appCache.get('game');
            game.clear('gameUUID');
         }
    });

    return new GameBtnController();
});
