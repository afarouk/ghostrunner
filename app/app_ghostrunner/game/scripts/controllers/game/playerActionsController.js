/*global define */

'use strict';

define([
    '../../appCache',
    '../../views/playerActions',
    '../../models/playerActions'
    ], function(appCache, PlayerActionsView, PlayerActionsModel){
    var PlayerActionsController = Mn.Object.extend({
		create: function(layout, region) {
            this.model = new PlayerActionsModel();
			this.view = new PlayerActionsView({
                model: this.model
            });
			layout.showChildView( region, this.view );

            this.listenTo(this.view, 'onPlayer:action', this.onAction, this);
		},
        onBeforeDestroy: function(){
            this.stopListening();
        },
        updateRole: function() {
            this.model.updateRole();
        },
        onAction: function(move) {
            this.publicController.getGameController().showLoader();
            if(move == 'PINCH_HIT'){
                this.publicController.getBrokerController().retrivePinchHit();
            }else{
                this.publicController.getStateController().onPlayerMove(move);
            }
        }
    });

    return new PlayerActionsController();
});
