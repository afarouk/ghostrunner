/*global define */
'use strict';

define([
    '../../appCache'
    ], function(appCache) {
    var brokerStateMixin = {
        //switch between broker states and tabs
        switchBrokerState: function(state, show) {
            switch(state) {
                //on invite user
                case 'invite':
                    if (show) {
                        this.hideRight();
                        this.confirm = 'invite';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented')
                            .removeClass('my-teams my-invites without-buttons cancel');
                        this.view.ui.confirm.attr('disabled', true);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'teams':
                    //on select team while invitation cycle
                    if (show) {
                        this.hideRight();
                        this.confirm = 'teams';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented my-teams')
                            .removeClass('my-lineups without-buttons cancel');
                        this.view.ui.teams.attr('disabled', false)
                            .addClass('inactive');
                        this.view.ui.lineups.attr('disabled', true);
                        this.view.ui.confirm.attr('disabled', true);
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
                        this.hideRight();
                        this.confirm = 'my_teams';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented my-teams without-buttons cancel')
                            .removeClass('my-lineups');
                        this.view.ui.teams.attr('disabled', false);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented without-buttons');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'lineups':
                    //on select predefined lineup while invitation cycle
                    if (show) {
                        this.hideRight();
                        this.confirm = 'lineups';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented my-lineups')
                            .removeClass('my-teams without-buttons cancel');
                        this.view.ui.lineups.attr('disabled', false)
                            .addClass('inactive');
                        this.view.ui.teams.attr('disabled', true);
                        this.view.ui.confirm.attr('disabled', true);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented cancel');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'my_lineups':
                    //show lineups list by clickin btn
                    if (show) {
                        this.hideRight();
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
                        this.hideLeft();
                        this.confirm = 'invites';
                        this.view.$el.find('.broker-list.right-list')
                            .addClass('shown presented invites-active')
                            .removeClass('games-active without-buttons cancel');
                        this.view.ui.confirm.attr('disabled', true);
                    } else {
                        this.confirm = undefined;
                        this.view.$el.find('.broker-list.right-list')
                            .removeClass('shown presented invites-active cancel');
                        this.destroyCurrentView();
                    }
                    break;
                case 'games':
                    //show available games list
                    if (show) {
                        this.hideLeft();
                        this.confirm = 'games';
                        this.view.$el.find('.broker-list.right-list')
                            .addClass('shown presented games-active')
                            .removeClass('invites-active without-buttons');
                        this.view.ui.confirm.attr('disabled', true);
                    } else {
                        this.confirm = undefined;
                        this.view.$el.find('.broker-list.right-list')
                            .removeClass('shown presented games-active');
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

        //hide opened left tabs
        hideLeft: function() {
            if (this.confirm === 'invite' ||
                this.confirm === 'my_teams' ||
                this.confirm === 'my_lineups') {

                this.confirm = undefined;
                this.view.$el.find('.broker-list.left-list').removeClass('shown presented cancel');
                this.destroyCurrentView();
            }
        },
        //hide opened right tabs
        hideRight: function() {
            if (this.confirm === 'games' || this.confirm === 'invites') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.right-list')
                    .removeClass('shown presented games-active invites-active');
                this.destroyCurrentView();
            }
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
