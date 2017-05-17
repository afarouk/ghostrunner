/*global define */

'use strict';

define([
    '../../Vent',
    '../../views/gameInterface'
    ], function(Vent, GameInterfaceView){
    var GameInterfaceController = Mn.Object.extend({
		create: function(layout, region) {
			this.view = new GameInterfaceView();
			layout.showChildView( region, this.view );
			this.showLoader();
		},
        showLoader: function() {
            this.view.triggerMethod('showLoader');
        },
        hideLoader: function() {
            this.view.triggerMethod('hideLoader');
        },
        showTossAnimation: function() {
            this.view.triggerMethod('showTossAnimation');
        }
    });

    return new GameInterfaceController();
});
