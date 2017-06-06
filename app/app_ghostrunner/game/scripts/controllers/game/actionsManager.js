/*global define */

'use strict';

define([
    ], function(){
    var ActionsManager = Mn.Object.extend({
		onAction: function(action) {
            switch (action) {
                case 'pitch':
                    this.publicController.getStateController().onPlayerMove(action);
                    break;

                default:
                    this.publicController.getStateController().onPlayerMove(action);
                    break;
            }
        }
    });

    return new ActionsManager();
});
