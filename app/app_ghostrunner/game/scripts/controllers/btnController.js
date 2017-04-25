/*global define */

'use strict';

define([
    '../Vent',
    '../views/partials/gameBtn',
    '../APIGateway/gameService',
    '../appCache'
    ], function(Vent, GameBtnView,service,appCache){
    var GameBtnController = Mn.Object.extend({
            create: function(layout, region) {
                this.view = new GameBtnView();
                layout.showChildView( region, this.view );
            },showAbandonBtn: function() {
                this.view.triggerMethod('showAbandonBtn');
            },hideAbandonBtn: function() {
                this.view.triggerMethod('hideAbandonBtn');
            },
           clickAbandonBtn : function(){
               this.publicController.getInterfaceController().showLoader();
               service.abandonGame()
                   .then(function(status){
                   this.publicController.getInterfaceController().hideLoader();
                   this.removeGameUUID();
                   this.publicController.getStateController().refreshStatus();
                   this.hideAbandonBtn();
                    }
                    .bind(this), function(err){
                    this.publicController.getInterfaceController().hideLoader();
                    //this.hideAbandonBtn();
                    this.removeGameUUID();
                   
                    }
                    .bind(this));
           },
           removeGameUUID:function(){
                var game= appCache.get('game');
                game.clear('gameUUID');
            }
        });

    return new GameBtnController();
});
