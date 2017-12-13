/*global define */
'use strict';

define([
    '../../appCache'
    ], function(appCache) {
    var brokerStateMixin = {
        showViewInRegion: function(viewToAdd, name) {
            var $el = this.view.$el.find('[name="' + name + '"] .list-container');

            var listRegion = this.view.getRegion('listRegion');
            if (listRegion) listRegion.empty();

            this.view.addRegion('listRegion', $el);
            this.view.showChildView('listRegion', viewToAdd);
        },
        //switch between broker states and tabs
        switchBrokerState: function(state, show) {
            switch(state) {
                //on invite user
                case 'invite':
                    if (show) {
                        this.confirm = 'invite';
                        this.view.ui.invite.addClass('scripted');
                    } else {
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'teams':
                    //on select team while invitation cycle
                    if (show) {
                        this.confirm = 'teams';
                        this.view.ui.teams.attr('disabled', false)
                            .addClass('inactive scripted');
                        this.view.ui.lineups.attr('disabled', true);
                        this.view.ui.my_games.attr('disabled', true);
                        this.view.ui.my_invites.attr('disabled', true);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'my_teams':
                    //show teams list by clickin btn
                    if (show) {
                        this.confirm = 'my_teams';
                        this.view.ui.teams.attr('disabled', false);
                    } else {
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'lineups':
                    //on select predefined lineup while invitation cycle
                    if (show) {
                        this.confirm = 'lineups';
                        this.view.ui.lineups.addClass('inactive scripted');
                        this.view.ui.teams.attr('disabled', true);
                        this.view.ui.my_games.attr('disabled', true);
                        this.view.ui.my_invites.attr('disabled', true);
                    } else {
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'my_lineups':
                    //show lineups list by clickin btn
                    if (show) {
                        this.confirm = 'my_lineups';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented my-lineups without-buttons')
                            .removeClass('my-teams cancel');
                        this.view.ui.teams.attr('disabled', false);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented without-buttons cancel');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'invites':
                    //show current invitations list
                    if (show) {
                        this.confirm = 'invites';
                    } else {
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'games':
                    //show available games list
                    if (show) {
                        this.confirm = 'games';
                        this.view.ui.my_games.addClass('scripted');
                    } else {
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'starterSelection':
                    //for switch state to teams
                    this.view.ui.invite.attr('disabled', true);
                    this.view.ui.confirm.attr('disabled', true);
                    this.view.ui.rightBroker.addClass('team-state');
                    this.view.ui.cancel.attr('disabled', false);
                    this.onGetTeams();
                    break;
                case 'lineUpSelection':
                    //for switch state to lineups
                    this.view.ui.invite.attr('disabled', true);
                    this.view.ui.confirm.attr('disabled', true);
                    this.view.ui.rightBroker.addClass('lineup-state');
                    this.view.ui.cancel.attr('disabled', false);
                    this.confirm = 'beforeLineups';
                    this.onGetMyLineups();
                    break;
                default:
                    break;
            }
        },

        //close some menus on broker area click
        onBrokerClicked: function() {
            if (this.confirm === 'invite' ||
                this.confirm === 'my_teams' ||
                this.confirm === 'my_lineups' ||
                this.confirm === 'games' ||
                this.confirm === 'invites') {
                this.switchBrokerState(this.confirm, false);
            }
            return true;
        },

        //loader
        showLoader: function() {
            this.view.ui.loader.show();
        },
        hideLoader: function() {
            this.view.ui.loader.hide();
        },

        //manage what was confirmed
        onConfirm: function() {
            switch (this.confirm) {
                case 'invite':
                    this.confirmUser();
                    break;
                case 'invites':
                case 'games':
                    this.confirmGame();
                    break;
                case 'teams':
                    if (this.invitationDef) {
                        this.selectCandidate();
                    }
                    break;
                case 'lineups':
                    if (this.invitationDef) {
                        this.onLineupSelected();
                    }
                    break;
                default:
                    break;
            }
        },

        onCancel: function() {
            this.reRender();
            this.view.$el.removeClass('creation-state');
            this.teamConfirm = undefined;
            this.confirm = undefined;
            this.invitationDef = null;

            //Return to game if game running
            var game = appCache.get('game');
            if (game && game.get('gameUUID') && game.get('state') === 'RUNNING') {
                this.publicController.getGameController().switchToGame();
            } else {
                this.publicController.getStateController().killGame();
            }
        },

        onTeamConfirm: function() {
            this.view.ui.invite.attr('disabled', true);
            this.invitationDef.resolve(this.selectedTeam);
            this.invitationDef = null;
        },

        switchToStarterState: function() {
            this.switchBrokerState('starterSelection', true);
            this.invitationDef = $.Deferred();
            return this.invitationDef;
        },

        switchToLineUpState: function() {
            this.switchBrokerState('lineUpSelection', true);
            this.invitationDef = $.Deferred();
            return this.invitationDef;
        },

        disableLineUps: function() {
            this.view.ui.lineups.attr('disabled', true);
            this.view.$el.find('.broker-list.left-list')
                .removeClass('shown presented')
                .addClass('cancel');
        },

        playerReplacementMode: function(action){
            this.publicController.getGameController().setPlayerReplacementState();

            this.publicController.getPlayerReplacementController().managePlayerReplacement(this.view, action);
        }
    };
    
    return brokerStateMixin;    
});
