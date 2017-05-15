/*global define */

'use strict';

define([
    '../../Vent'
    ], function(Vent){
    var ActionsManager = Mn.Object.extend({
		onAction: function(action) {
            switch (action) {
                case 'move':
                    this.publicController.getStateController().onPlayerMove();
                    break;

                default:
                    // this.publicController.getStateController().onPlayerMove();
                    break;
            }
        }
    });

    return new ActionsManager();
});
