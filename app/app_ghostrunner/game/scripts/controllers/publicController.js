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
    './broker/brokerMobileController', //broker part with user/game selection
    './broker/createTeamController', // select players in team/lineUp
    './broker/createTeamMobileController', // select players in team/lineUp

    './game/gameStateController', //make changes/calls related on game model state
    './game/stateManager', //manage states for game model
    './game/signalManager', //manege websocket signals
    './game/socketController', //websockets connect/disconnect
    './game/gameFieldController',
    './game/gameInterfaceController',
    './game/informationTableController', //shows table with game scores, current players info, etc
    './game/playerActionsController', //show buttons related on role
    './game/playerActionsMobileController',
    './broker/playerReplacementController',
    './broker/playerReplacementMobileController'
    ], function( pageController, gameController, urlController, chatController, 
        modalsController, choiceController, brokerController, brokerMobileController, createTeamController, createTeamMobileController,
        stateController , stateManager, signalManager, socketController, 
        fieldController,interfaceController, informationTableController, 
        playerActionsController, playerActionsMobileController, playerReplacementController, playerReplacementMobileController) {
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
            return window.ghostrunner.isDesktop ? brokerController : brokerMobileController;
        },
        getCreateTeamController: function() {
            return window.ghostrunner.isDesktop ? createTeamController : createTeamMobileController;
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
            return window.ghostrunner.isDesktop ? playerActionsController : playerActionsMobileController;
        },
        getPlayerReplacementController: function() {
            return window.ghostrunner.isDesktop ? playerReplacementController : playerReplacementMobileController;
        },
        getDevice: function() {
            return window.ghostrunner.isDesktop ? 'desktop' : 'mobile';
            // var device = 'desktop';
            // if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            //     device = 'mobile';
            // } else if (/iPad/i.test(navigator.userAgent)) {
            //     device = 'tablet';
            // }
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
