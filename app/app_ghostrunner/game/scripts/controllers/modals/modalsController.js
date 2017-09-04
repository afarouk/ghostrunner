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
                    .then(this.afterTeamRemoved.bind(this, teamName, $def), function(xhr){
                        this.publicController.getGameController().hideLoader();
                        this.publicController.getModalsController().apiErrorPopup(xhr);
                    }.bind(this));
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

        onMessageFromAnotherUserPause: function() {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                message: 'Message received regarding other game.<br>Pause game and answer?',
                cancel: 'cancel',
                confirm: 'next'
            }).then(function(){
                $def.resolve();
            }.bind(this), function() {
                $def.reject();
            }.bind(this));
            return $def;
        },

        onMessageFromAnotherUserSwitch: function() {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                message: 'Message received regarding other game.<br>Switch and answer?',
                cancel: 'cancel',
                confirm: 'next'
            }).then(function(){
                $def.resolve();
            }.bind(this), function() {
                $def.reject();
            }.bind(this));
            return $def;
        },

        onPayloadMessage: function(message) {
            var $def = $.Deferred(),
                text = message.payload + '<br>Please, select yours';
            this.publicController.getChoiceController().showConfirmation({
                message: text,
                cancel: 'cancel',
                confirm: 'next'
            }).then(function(){
                $def.resolve();
            }.bind(this), function() {
                $def.reject();
            }.bind(this));
            return $def;
        },

        onRuningGamePresented: function(game) {
            this.publicController.getChoiceController().showConfirmation({
                message: 'You have a running game with ' + game.opponentUserName + '.<br>Restart the game?',
                cancel: 'cancel',
                confirm: 'yes'
            }).then(function(){
                this.publicController.getStateController().refreshStatus(game.gameUUID);
            }.bind(this), function() {
                this.onPauseGame(game.gameUUID);
            }.bind(this));
        },

        onReceivedInvitationPresented: function(invites) {
            var message = invites.length > 1 ?
                'You have received invitations. Please, check them.' :
                'You have received an invitation. Please, check it.';
            this.publicController.getChoiceController().showConfirmation({
                message: message,
                confirm: 'Ok'
            }).then(function(){
                //TODO maybe open invitations selector or answer to first available iinvitation
                //as idea we could show circle with nubmer of available invittations as on communitiexpress
                // or something similar
            }.bind(this));
        },

        //invitation
        onInvitationReceived: function(gameModel) {
            var other = gameModel.get('otherUser').user.userName,
                gameName = gameModel.get('displayText');
            this.publicController.getChoiceController().showConfirmation({
                message: other + ' has invited you to a game. <br> Accept invitation?',
                cancel: 'cancel',
                reject: 'no',
                confirm: 'yes'
            }).then(function(){
                this.onInvitationConfirmed(gameModel);
            }.bind(this), function(type) {
                if (type === 'reject') {
                    this.publicController.getStateController().onInvitationRejected(gameModel);
                } else {
                    this.publicController.getStateController().killGame();
                }
            }.bind(this));
            console.log('invitation received');
        },

        beforeLineUpShape: function(gameModel) {
            //when user is initiator also show opponent starter selection info and players card
            this.publicController.getGameController().switchToBroker();
            this.onOtherPlayerLineUp(gameModel)
                .then(function(){
                    return this.publicController.getBrokerController().lineUpShape();
                }.bind(this));
        },

        onInvitationConfirmed: function(gameModel) {
            //when user isn't initiator show opponent starter selection info and players card
            this.publicController.getGameController().switchToBroker();
            this.onOtherPlayerLineUp(gameModel, 'select')
                .then(function(){
                    return this.publicController
                        .getBrokerController().switchToLineUpState()
                            .then(function(team, lineUpName, playerModel) {
                                this.publicController.getStateController().afterCandidateSelected(team, lineUpName, playerModel);
                            }.bind(this));
                }.bind(this));
        },

        afterInvitationSend: function(userName) {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                    message: 'Invitation sent to ' + userName,
                    confirm: 'ok'
                }).then(function() {
                    $def.resolve();
                }.bind(this));
            return $def;
        },

        afterStarterSelected: function() {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                    message: 'Starter selection sent',
                    confirm: 'ok'
                }).then(function() {
                    $def.resolve();
                }.bind(this));
            return $def;
        },

        afterLineUpSelected: function() {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                    message: 'Lineup selection sent',
                    confirm: 'ok'
                }).then(function() {
                    $def.resolve();
                }.bind(this));
            return $def;
        },

        onInitiatorsLineUpWasSelected: function() {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                    message: 'Inviter has selected his line up. <br>Please, select yours.',
                    cancel: 'cancel',
                    confirm: 'next'
                }).then(function() {
                    this.publicController.getBrokerController().lineUpShape('accept');
                    $def.resolve();
                }.bind(this), function() {
                    $def.reject();
                }.bind(this));
            return $def;
        },

        onOtherPlayerLineUp: function(gameModel, select) {
            var $def = $.Deferred(),
                otherLineUp = gameModel.get('otherLineUp'),
                lineUpName = otherLineUp.displayText,
                selectMessage = select ? '<br>Please, select yours.' : '<br>Please, select your line up.',
                player = '<a class="starter-player" name="action">' + otherLineUp.players[0].displayText + '</a>';
            this.publicController.getChoiceController().showConfirmation({
                message: 'Opponent selected ' + player + ' as starter.' + selectMessage,
                cancel: 'cancel',
                confirm: 'ok'
            }).then(function() {
                $def.resolve()
            }.bind(this), function() {
                $def.reject();
            }.bind(this));

            return $def;
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
                        displayText: 'AWAY'
                    },
                    {
                        action: 'DEFENSE',
                        displayText: 'HOME'
                    }
                ]
            }).then(function(role){
                def.resolve(role)
            }.bind(this));
            return def;
        },

        //secondary
        onSecondaryMove: function(secondary) {
            this.publicController.getChoiceController().showRadioChoise({
                message: secondary.displayText,
                choices: secondary.choices,
                confirm: 'SEND'
            }).then(function(choiceId){
                this.publicController.getStateController().makeSecondaryMove(secondary.eventId, choiceId);
            }.bind(this));
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
            this.publicController.getGameController().showLoader();

            this.publicController.getStateController().onPauseGame(gameUUID)
                .then(function(status){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getGameController().switchToBroker();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(err){
                    this.publicController.getGameController().hideLoader();
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
                this.publicController.getGameController().showLoader();
                service.abandonGame()
                .then(function(status){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getGameController().switchToBroker();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(xhr){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getModalsController().apiErrorPopup(xhr);
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
                this.publicController.getStateController().killGame();
                this.publicController.getBrokerController().reRender();
            }.bind(this));
        },

        onInningOver: function(gameUUID) {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Inning over.',
                confirm: 'ok'
            }).then(function() {
                this.publicController.getStateController().refreshStatus(gameUUID);
            }.bind(this));
            console.log('inning over');
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
                this.publicController.getGameController().showLoader();
                service.abandonGame()
                .then(function(status){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getGameController().switchToBroker();
                    this.publicController.getStateController().refreshStatus();
                }
                .bind(this), function(xhr){
                    this.publicController.getGameController().hideLoader();
                    this.publicController.getModalsController().apiErrorPopup(xhr);
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
        },

        onForceLogout: function() {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                message: 'Parallel login detected.',
                confirm: 'ok'
            }).then(function() {
                $def.resolve();
            }.bind(this), function(){
                $def.reject();
            }.bind(this));
            return $def;
        },

        onConnectionLost: function() {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                message: 'Connection was lost.<br>Try to reconnect?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function() {
                $def.resolve();
            }.bind(this), function(){
                $def.reject();
            }.bind(this));
            return $def;
        },

        afterSaveRequest: function() {
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                    message: 'Request Sent',
                    confirm: 'OK'
                }).then(function() {
                    $def.resolve();
                }.bind(this));
            return $def;
        },

        refreshGamePopup: function(){
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
              message: 'Game Updated',
              confirm: 'ok'
            }).then(function() {
              $def.resolve();
            }.bind(this));
            return $def;
        },

        apiErrorPopup: function(xhr){
            var message;
            if(xhr.responseJSON.error.message)
            {
                message = xhr.responseJSON.error.message + " .";
            }
            else
            {
                message = "Something went wrong. ";
            }
            this.publicController.getChoiceController().showConfirmation({
                message: message,
                confirm: 'ok'
            }).then(function() {
                /////   /////
            }.bind(this));
        },

        buttonPopup: function(){
            var $def = $.Deferred();
            this.publicController.getChoiceController().showConfirmation({
                message: ' Move done ',
                confirm: 'ok'
            }).then(function() {
                $def.resolve();
            }.bind(this));
        },

        onLineUpEditConfirmation: function() {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Edit your lineup?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                this.onLineUpEditConfirmed();
            }.bind(this), function() {
                this.onLineUpEditRejected();
            }.bind(this));
        },

        onLineUpEditConfirmed: function() {
            // this.publicController.getGameController().showLoader();
            this.publicController.getStateController().onLineUpEditStart();
        },

        onLineUpEditRejected: function() {
            this.publicController.getStateController().onLineUpEditReject();
        }
    });

    return new ModalsController();
});
