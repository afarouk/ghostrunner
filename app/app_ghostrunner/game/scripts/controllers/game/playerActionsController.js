/*global define */

'use strict';

define([
    '../../appCache',
    '../../views/playerActions',
    '../../models/playerActions'
    ], function(appCache, PlayerActionsView, PlayerActionsModel){
    var PlayerActionsController = Mn.Object.extend({
		create: function(layout, region) {
            var gameModel = appCache.get('game');
            this.model = new PlayerActionsModel(gameModel.get('thisUser').role);
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
