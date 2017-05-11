/*global define */

'use strict';

define([
    './pageController',
    './chatController',
    './broker/choiceController',
    './broker/selectController',
    './broker/modalsController',
    './game/gameController',
    './game/gameStateController',
    './game/stateManager',
    './game/signalManager',
    './game/socketController',
    './game/gameFieldController',
    './game/gameInterfaceController',
    './game/informationTableController',
    './game/playerActionsController',
    './game/btnController'
    ], function( pageController, chatController, choiceController, selectController, modalsController, 
        gameController, stateController , stateManager, signalManager, socketController, fieldController,
        interfaceController, informationTableController, playerActionsController, btnController ) {
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
        getStateManager: function() {
            return stateManager;
        },
        getSignalManager: function() {
            return signalManager;
        },
        getSocketController: function() {
            return socketController;
        },
        getGameBtnController: function() {
            return btnController;
        },
        getSelectController: function() {
            return selectController;
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
        getChoiceController: function() {
            return choiceController;
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
