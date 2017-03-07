/*global define */

'use strict';

define([
    '../Vent',
    '../views/gameInterface'
    ], function(Vent, GameInterfaceView){
    var GameInterfaceController = Mn.Object.extend({
    		create: function(layout, region) {
    			this.view = new GameInterfaceView();
    			layout.showChildView( region, this.view );
    			this.view.triggerMethod('showMask');

    			this.listenTo(this.view, 'onPlayer:move', this.onMove, this);
                this.listenTo(this.view, 'onGame:stop', this.onStop, this)
    		},
    		showInterface: function() {
    			this.view.triggerMethod('hideMask');
    		},
    		onMove: function() {
    			console.log('move');
    			this.view.triggerMethod('showMask');
    			//TEMPORARY for test
    			this.publicController.getStateController().onPlayerMove();
    			//..........
    		},
            onStop: function() {
                console.log('stop');
                this.view.triggerMethod('showMask');
                //TEMPORARY for testing
                this.publicController.getStateController().onGameStop();
            }
        });

    return new GameInterfaceController();
});
