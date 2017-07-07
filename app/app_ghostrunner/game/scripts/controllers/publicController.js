/*global define */

'use strict';

define([
    './pageController', //manage parent page (login/logout)
    './gameController', //switch between broker/game etc...
    './urlController',  //manage url query
    './chatController', //for chat

    './modals/modalsController', //modals
    './modals/choiceController', //user choice

    './broker/brokerController', //broker part with user/game selection
    './broker/createTeamController', // select players in team/lineUp

    './game/gameStateController', //make changes/calls related on game model state
    './game/stateManager', //manage states for game model
    './game/signalManager', //manege websocket signals
    './game/socketController', //websockets connect/disconnect
    './game/gameFieldController',
    './game/gameInterfaceController',
    './game/informationTableController', //shows table with game scores, current players info, etc
    './game/playerActionsController', //show buttons related on role
    './broker/pinchHitterController'
    ], function( pageController, gameController, urlController, chatController, 
        modalsController, choiceController, brokerController, createTeamController,
        stateController , stateManager, signalManager, socketController, 
        fieldController,interfaceController, informationTableController, 
        playerActionsController,pinchHitterController) {
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
        getCreateTeamController: function() {
            return createTeamController;
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
        getpinchHitterController: function() {
            return pinchHitterController;
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
