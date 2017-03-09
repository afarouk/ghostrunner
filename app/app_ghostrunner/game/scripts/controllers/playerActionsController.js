/*global define */

'use strict';

define([
    '../Vent',
    '../views/playerActions',
    '../models/playerActions'
    ], function(Vent, PlayerActionsView, PlayerActionsModel){
    var PlayerActionsController = Mn.Object.extend({
    		create: function(layout, region) {
                this.model = new PlayerActionsModel();
    			this.view = new PlayerActionsView({
                    model: this.model
                });
    			layout.showChildView( region, this.view );

                this.listenTo(this.view, 'onPlayer:move', this.onMove, this);
                this.listenTo(this.view, 'onGame:stop', this.onStop, this)
    		},
            onMove: function() {
                console.log('move');
                this.publicController.getInterfaceController().showLoader();
                //TEMPORARY for test
                this.publicController.getStateController().onPlayerMove();
                //..........
            },
            onStop: function() {
                console.log('stop');
                this.publicController.getInterfaceController().showLoader();
                //TEMPORARY for testing
                this.publicController.getStateController().onGameStop();
            }
        });

    return new PlayerActionsController();
});
