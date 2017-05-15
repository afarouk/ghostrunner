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

            this.listenTo(this.view, 'onPlayer:move', this.onMove, this);
		},
        onBeforeDestroy: function(){
            this.stopListening();
        },
        updateRole: function(role) {
            this.model.updateRole(role);
        },
        onMove: function() {
            console.log('move');
            this.publicController.getInterfaceController().showLoader();
            //TEMPORARY for test
            this.publicController.getStateController().onPlayerMove();
            //..........
        }
    });

    return new PlayerActionsController();
});
