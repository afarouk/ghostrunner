/*global define */

'use strict';

define([
    './pageController',
    './gameController',
    './gameStateController',
    './socketController',
    './gameFieldController',
    './gameInterfaceController',
    './informationTableController',
    './playerActionsController',
    './chatController'
    ], function( pageController, gameController, stateController , socketController, fieldController, 
        interfaceController, informationTableController, playerActionsController, chatController){
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
            },
            getInformationTableController: function() {
                return informationTableController;
            },
            getPlayerActionsController: function() {
                return playerActionsController;
            },
            getChatController: function() {
                return chatController;
            }
        });

    return new PublicController();
});
