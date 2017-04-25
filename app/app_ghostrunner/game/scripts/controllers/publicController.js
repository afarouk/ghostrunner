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
    './chatController',
    './playerChoiceController',
    './btnController',
    './gameChoiceController'
    ], function( pageController, gameController, stateController , socketController, fieldController, 
        interfaceController, informationTableController, playerActionsController, chatController, playerChoiceController,btnController,gameChoiceController){
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
            getGameBtnController: function() {
                return btnController;
            },
            getGameChoiceController: function() {
                return gameChoiceController;
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
            },
            getPlayerChoiceController: function() {
                return playerChoiceController;
            },
            destroyGame: function() {
                //destroy all controllers
                //with listenTo etc...
                socketController.destroy();
                playerActionsController.destroy();
                informationTableController.destroy();
            }
        });

    return new PublicController();
});
