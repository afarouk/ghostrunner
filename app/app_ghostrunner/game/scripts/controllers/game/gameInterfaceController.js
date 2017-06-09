/*global define */

'use strict';

define([
    '../../appCache',
    '../../views/gameInterface'
    ], function(appCache, GameInterfaceView){
    var GameInterfaceController = Mn.Object.extend({
		create: function(layout, region) {
            var gameModel = appCache.get('game');
			this.view = new GameInterfaceView();
			layout.showChildView( region, this.view );
			this.showLoader();
            if (gameModel.get('showTossAnimation')) {
                this.showTossAnimation();
            }
		},
        showLoader: function(type) {
            this.view.triggerMethod('showLoader', type);
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
