/*global define */

'use strict';

define([
    '../../appCache',
    '../../views/gameInterface'
    ], function(appCache, GameInterfaceView){
    var GameInterfaceController = Mn.Object.extend({
		create: function(layout, region) {
			this.view = new GameInterfaceView();
			layout.showChildView( region, this.view );
			//this.showLoader();
		},
        showLoader: function(type) {
            this.view.triggerMethod('showLoader', type);  
            //this.view.ui.loader.show();
        },
        
        hideLoader: function() {
          this.view.triggerMethod('hideLoader');
          //this.view.ui.loader.hide();
        }

    });

    return new GameInterfaceController();
});
