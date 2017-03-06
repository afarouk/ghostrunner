/*global define */

'use strict';

define([
    './pageController',
    './gameController',
    './gameStateController',
    './socketController',
    './gameFieldController',
    './gameInterfaceController'
    ], function( pageController, gameController, stateController , socketController, fieldController, interfaceController){
    var PublicController = Mn.Object.extend({
            getPageController: function() {
                return pageController;
            },
            getGameController: function() {
                return gameController;
            },
            getStateController: function() {
                return stateController;
            },
            getSocketController: function() {
                return socketController;
            },
            getFieldController: function() {
                return fieldController;
            },
            getInterfaceController: function() {
                return interfaceController;
            }
        });

    return new PublicController();
});
