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
        onAction: function(action) {
            this.publicController.getGameController().showLoader();
            switch (action) {
                case 'LINEUP_EDIT':
                    this.publicController.getStateController().onLineUpEditStart(action);
                    break;
                case 'LINEUP_DONE':
                    this.publicController.getStateController().onLineUpEditDone(action);
                    break;
                case 'PINCH_HIT':
                case 'PINCH_RUN':
                case 'DEFENSIVE_SUBSTITUTION':
                case 'RELIEF_PITCHER':
                    this.publicController.getBrokerController().playerReplacementMode(action);
                    break;
                default:
                    this.publicController.getStateController().onPlayerMove(action);
                    break
            }
        }
    });

    return new PlayerActionsController();
});
