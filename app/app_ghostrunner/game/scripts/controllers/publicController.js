/*global define */

'use strict';

define([
    './pageController',
    './chatController',

    './modals/modalsController',
    './modals/choiceController',

    './broker/brokerController',

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
    ], function( pageController, chatController, 
        modalsController, choiceController, brokerController, 
        gameController, stateController , stateManager, signalManager, socketController, 
        fieldController,interfaceController, informationTableController, 
        playerActionsController, btnController ) {
    var PublicController = Mn.Object.extend({
        //misc
        getPageController: function() {
            return pageController;
        },
        getChatController: function() {
            return chatController;
        },

        //modals
        getModalsController: function() {
            return modalsController;
        },
        getChoiceController: function() {
            return choiceController;
        },

        //broker
        getBrokerController: function() {
            return brokerController;
        },

        //game
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
