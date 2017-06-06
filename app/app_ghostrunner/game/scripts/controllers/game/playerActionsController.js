/*global define */

'use strict';

define([
    '../../views/playerActions',
    '../../models/playerActions'
    ], function(PlayerActionsView, PlayerActionsModel){
    var PlayerActionsController = Mn.Object.extend({
		create: function(layout, region) {
            this.model = new PlayerActionsModel('defence');
			this.view = new PlayerActionsView({
                model: this.model
            });
			layout.showChildView( region, this.view );

            this.listenTo(this.view, 'onPlayer:action', this.onAction, this);
		},
        onBeforeDestroy: function(){
            this.stopListening();
        },
        updateRole: function(role) {
            this.model.updateRole(role);
        },
        onAction: function(action) {
            console.log('action: ', action);
            this.publicController.getGameController().showLoader();

            this.publicController.getActionsManager().onAction(action);
        }
    });

    return new PlayerActionsController();
});
