/*global define */

'use strict';

define([
    '../../Vent',
    '../../views/playerActions',
    '../../models/playerActions'
    ], function(Vent, PlayerActionsView, PlayerActionsModel){
    var PlayerActionsController = Mn.Object.extend({
        //TODO show buttons enabled/disabled 
        //depending on model
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
            this.publicController.getInterfaceController().showLoader();

            this.publicController.getActionsManager().onAction(action);
        }
    });

    return new PlayerActionsController();
});
