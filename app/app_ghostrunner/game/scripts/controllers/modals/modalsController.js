/*global define */

'use strict';

define([
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/modalsLayout'
    ], function(appCache, service, ModalsLayoutView){
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
        //remove team
        onRemoveTeam: function(teamName, teamUUID) {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                message: 'Are you sure you want to delete ' + teamName +' team?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                service.deleteTeam(teamUUID)
                    .then(this.afterTeamRemoved.bind(this, teamName, $def));
            }.bind(this), function() {
                $def.reject();
            }.bind(this));
            return $def;
        },
        afterTeamRemoved: function(teamName, $def) {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Team ' + teamName + ' succesfully removed.',
                confirm: 'ok'
            }).then(function() {
                $def.resolve();
            }.bind(this));
            console.log('team removed');
        },
        // onRemoveLineUp: function(lineUp) {
        //     var lineUpName = lineUp.displayText;
        //     this.publicController.getChoiceController().showConfirmation({
        //         message: 'Are you sure you want to delete ' + lineUpName +' lineUp?',
        //         cancel: 'cancel',
        //         confirm: 'confirm'
        //     }).then(function(){
        //         service.deleteLineUp(this.selectedTeam.get('teamUUID'), lineUp.lineUpId)
        //             .then(this.afterLineUpRemoved.bind(this, lineUpName));
        //     }.bind(this), function() {
                
        //     }.bind(this));
        // },

        // afterLineUpRemoved: function(lineUpName) {
        //     this.publicController.getChoiceController().showConfirmation({
        //         message: 'LineUp ' + lineUpName + ' succesfully removed.',
        //         confirm: 'ok'
        //     }).then(function() {
        //         this.onCancel();
        //     }.bind(this));
        //     console.log('team removed');
        // },
        
        //invitation
        onInvitationReceived: function(gameModel) {
            var other = gameModel.get('otherUser').user.userName,
                gameName = gameModel.get('displayText');
            this.publicController.getChoiceController().showConfirmation({
                message: other + ' sent you invitation to '+ gameName + '<br> accept invitation?',
                cancel: 'cancel',
                reject: 'no',
                confirm: 'yes'
            }).then(function(){
                this.publicController.getGameController().switchToBroker();
                this.onOtherPlayerLineUp(gameModel)
                    .then(function(){
                        return this.publicController
                            .getBrokerController().switchToLineUpState()
                                .then(function(team, lineUpName, playerModel) {
                                    this.publicController.getStateController().afterCandidateSelected(team, lineUpName, playerModel);
                                }.bind(this));
                    }.bind(this));
            }.bind(this), function(type) {
                if (type === 'reject') {
                    this.publicController.getStateController().onInvitationRejected(gameModel);
                }
            }.bind(this));
            console.log('invitation received');
        },

        afterInvitationSend: function(userName) {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                    message: 'Your invitation ' + userName + ' successfully sent.',
                    confirm: 'ok'
                }).then(function() {
                    $def.resolve();
                }.bind(this));
            return $def;
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

        //....interrupt
        onStartGameConfirmation: function(gameUUID) {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Start game?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.publicController.getStateController().refreshStatus(gameUUID);
            }.bind(this), function() {
                this.onPauseGame(gameUUID);
            }.bind(this));
        },

        onPauseGameConfirmation: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Pause game?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.onPauseGame();
            }.bind(this), function() {
                //
            }.bind(this));
        },

        onPauseGame: function(gameUUID) {
            // this.publicController.getInterfaceController().showLoader();

            service.pauseGame(gameUUID)
                .then(function(status){
                    this.publicController.getInterfaceController().hideLoader();
                    this.publicController.getGameController().switchToBroker();
                    this.publicController.getStateController().onGameStop();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(err){
                    this.publicController.getInterfaceController().hideLoader();
                }.bind(this));
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
