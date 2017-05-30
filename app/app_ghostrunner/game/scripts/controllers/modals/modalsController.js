/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/modalsLayout'
    ], function(Vent, appCache, service, ModalsLayoutView){
    //We need it for show modal dialogs
    var ModalsController = Mn.Object.extend({
        //create/show/hide logic
		create: function(layout, region) {
            this.view = new ModalsLayoutView();
            layout.showChildView( region, this.view );
        },

        show: function(view) {
            $('#modals').show();
            this.view.showChildView('container', view);
            this.view.getRegion('container').$el.show();
            return this.hide.bind(this);
        },

        hide: function() {
            $('#modals').hide();
            this.view.getRegion('container').$el.hide();
        },
        //modals parts
        // onInvitationReceived: function() {
        //     var game = appCache.get('game'),
        //         other = game.get('otherUser').user.userName,
        //         gameName = game.get('displayText');
        //     this.publicController.getChoiceController().showConfirmation({
        //         message: other + ' sent you invitation to '+ gameName + '<br> accept invitation?',
        //         cancel: 'cancel',
        //         reject: 'no',
        //         confirm: 'yes'
        //     }).then(function(){
        //         this.onSelectRole()
        //             .then(function(role){
        //                 return this.publicController
        //                     .getBrokerController().switchToLineUpState()
        //                     .then(function(selectedTeam){
        //                         this.publicController.getStateController().onInvitationAccepted(role, selectedTeam);
        //                     }.bind(this));
        //             }.bind(this));
        //     }.bind(this), function(type) {
        //         //TODO something
        //         if (type === 'reject') {
        //             this.publicController.getStateController().onInvitationRejected(game);
        //         } else {
        //             // this.publicController.getStateController().onGetMygames();
        //         }
        //     }.bind(this));
        //     console.log('invitation received');
        // },
        onInvitationReceived: function(gameModel) {
            // debugger;
            var other = gameModel.get('otherUser').user.userName,
                gameName = gameModel.get('displayText');
            this.publicController.getChoiceController().showConfirmation({
                message: other + ' sent you invitation to '+ gameName + '<br> accept invitation?',
                cancel: 'cancel',
                reject: 'no',
                confirm: 'yes'
            }).then(function(){
                this.onOtherPlayerLineUp(gameModel)
                    .then(function(){
                        return this.publicController
                            .getBrokerController().switchToLineUpState()
                                .then(function(team, lineUpName, playerModel) {
                                    this.publicController.getStateController().afterCandidateSelected(team, lineUpName, playerModel);
                                }.bind(this));
                    }.bind(this));
            }.bind(this), function(type) {
                //TODO something
                if (type === 'reject') {
                    this.publicController.getStateController().onInvitationRejected(game);
                } else {
                    // this.publicController.getStateController().onGetMygames();
                }
            }.bind(this));
            console.log('invitation received');
        },

        onOtherPlayerLineUp: function(gameModel) {
            var def = $.Deferred(),
                otherLineUp = gameModel.get('otherLineUp'),
                lineUpName = otherLineUp.displayText,
                player = otherLineUp.players[0].displayText;

            this.publicController.getChoiceController().showConfirmation({
                message: 'Opponent created lineup ' + lineUpName + ' and selected ' + player + ' player',
                confirm: 'ok'
            }).then(function() {
                def.resolve()
            }.bind(this));

            return def;
        },

        onSelectRole: function() {
            var def = $.Deferred();
            this.publicController.getChoiceController().showChoise({
                message: 'Please, select preferred role:',
                choices: [
                    {
                        action: 'DUAL',
                        displayText: 'Don\'t care'
                    },
                    {
                        action: 'OFFENSE',
                        displayText: 'Offence'
                    },
                    {
                        action: 'DEFENSE',
                        displayText: 'Defence'
                    }
                ]
            }).then(function(role){
                def.resolve(role)
            }.bind(this));
            return def;
        },

        onPausedByOponnent: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Game paused by oponnent.',
                confirm: 'ok'
            }).then(function() {
                this.publicController.getGameController().switchToBroker();
                this.publicController.getStateController().refreshStatus();
            }.bind(this));
            console.log('invitation received');
        },

        onAbandoneGame: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Abandon the game (final)?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.publicController.getInterfaceController().showLoader();
                service.abandonGame()
                .then(function(status){
                    this.publicController.getInterfaceController().hideLoader();
                    this.publicController.getGameController().switchToBroker();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(err){
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
            }.bind(this), function() {
                //todo
            }.bind(this));
        },

        onAbandonedByOponnent: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Game abandoned by oponnent.',
                confirm: 'ok'
            }).then(function() {
                this.publicController.getGameController().switchToBroker();
                this.publicController.getStateController().refreshStatus();
            }.bind(this));
        },

        onRejectedByOponnent: function(message) {
            this.publicController.getChoiceController().showConfirmation({
                message: message.payload,
                confirm: 'ok'
            }).then(function() {
                this.publicController.getStateController().refreshStatus();
            }.bind(this));
        },

        onGameOver: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Game over.',
                confirm: 'ok'
            }).then(function() {
                this.publicController.getGameController().switchToBroker();
                this.publicController.getStateController().refreshStatus();
            }.bind(this));
            console.log('game over');
        },

        onAbandoneGame: function() {
            // var game = appCache.get('game'),
            //     other = game.get('otherUser').user.userName,
            //     gameName = game.get('displayText');
            this.publicController.getChoiceController().showConfirmation({
                message: 'Abandon the game (final)?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.publicController.getInterfaceController().showLoader();
                service.abandonGame()
                .then(function(status){
                    this.publicController.getInterfaceController().hideLoader();
                    this.publicController.getGameController().switchToBroker();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(err){
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
            }.bind(this), function() {
                //todo
            }.bind(this));
        },

        onUnpauseGame: function (gameUUID) {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Unpause this game?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.publicController.getStateController().unPauseGame(gameUUID);
            }.bind(this), function() {
                this.publicController.getGameController().switchToBroker();
            }.bind(this));
        },

        onError: function (error) {
            var message = error.responseJSON.error.message;
            this.publicController.getChoiceController().showConfirmation({
                message: message,
                confirm: 'ok'
            }).then(function() {
                this.publicController.getBrokerController().onCancel();
            }.bind(this));
        }

    });

    return new ModalsController();
});
