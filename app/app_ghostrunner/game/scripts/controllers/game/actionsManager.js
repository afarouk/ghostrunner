/*global define */

'use strict';

define([
    ], function(){
    var ActionsManager = Mn.Object.extend({
		onAction: function(action, moveEnum) {
            switch (action) {
                case 'pitch':
                    this.publicController.getStateController().onPlayerMove(moveEnum);
                    break;

                default:
                    this.publicController.getStateController().onPlayerMove(moveEnum);
                    break;
            }
        }
    });

    return new ActionsManager();
});
