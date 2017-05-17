/*global define */

'use strict';

define([
    './pageController',
    './urlController',
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
    './game/actionsManager',
    './game/btnController'
    ], function( pageController, urlController, chatController, 
        modalsController, choiceController, brokerController, 
        gameController, stateController , stateManager, signalManager, socketController, 
        fieldController,interfaceController, informationTableController, 
        playerActionsController, actionsManager, btnController ) {
    var PublicController = Mn.Object.extend({
        //base
        getPageController: function() {
            return pageController;
        },
        getUrlController: function() {
            return urlController;
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
        getActionsManager: function() {
            return actionsManager;
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
