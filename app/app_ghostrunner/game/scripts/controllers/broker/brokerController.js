/*global define */

'use strict';

define([
    '../../appCache',
    '../../views/mainBroker',
    '../../views/partials/teamsList',
    '../../views/partials/usersList',
    '../../views/partials/gamesList',
    '../../views/partials/invitesList',
    '../../views/partials/emptyList',
    '../../APIGateway/gameService'
    ], function(appCache, MainBrokerView, TeamsList, UsersList, GamesList, InvitesList, EmptyListView, service){
    var BrokerController = Mn.Object.extend({
        create: function(layout, region) {
            this.view = new MainBrokerView();
            layout.showChildView( region, this.view );
            this.listenTo(this.view, 'getTeams', this.onGetMyTeams.bind(this));
            this.listenTo(this.view, 'getUsers', this.onGetUsers.bind(this));
            this.listenTo(this.view, 'getInvites', this.onGetInvites.bind(this));
            this.listenTo(this.view, 'getGames', this.onGetGames.bind(this));
            this.listenTo(this.view, 'confirm', this.onConfirm.bind(this));
            this.listenTo(this.view, 'cancel', this.onCancel.bind(this));
            this.listenTo(this.view, 'team:confirm', this.onTeamConfirm.bind(this));
            this.checkGameUrlUUID();
        },
        reRender: function () {
            this.confirm = undefined;
            this.view.$el.removeClass('creation-state');
            this.view.render();
        },
        //url uuid precense
        checkGameUrlUUID: function() {
            //TODO maybe show url game status
            var gameUUID = this.getUrlGameUUID();
            if (gameUUID) {
                this.publicController.getStateController().refreshStatus(gameUUID);
            }
        },
        setGameUUID: function(gameUUID){
            appCache.set('urlGameUUID', gameUUID); //for temporary save gameUUID that passed through url params
        },

        getUrlGameUUID: function() {
            return appCache.get('urlGameUUID');
        },

        removeUrlGameUUID: function() {
            appCache.remove('urlGameUUID');
        },
        //empty list
        showEmptyList: function(message) {
            var emptyList = new EmptyListView({
                model: new Backbone.Model({message: message})
            });
            this.view.showChildView('rightList', emptyList);
        },
        destroyCurrentView: function() {
            var currentView = this.view.getRegion('rightList').currentView ||
                this.view.getRegion('leftList').currentView;
            if (currentView) {
                currentView.destroy();
            }
        },
        switchBrokerState: function(state, show) {
            switch(state) {
                case 'invite':
                    if (show) {
                        this.hideRight();
                        this.confirm = 'invite';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented').removeClass('my-teams without-buttons');
                        this.view.ui.confirm.attr('disabled', true);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'teams':
                    if (show) {
                        this.hideRight();
                        this.confirm = 'teams';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented my-teams')
                            .removeClass('without-buttons');
                        this.view.ui.teams.attr('disabled', false)
                            .addClass('inactive');
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'my_teams':
                    if (show) {
                        this.hideRight();
                        this.confirm = 'my_teams';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented my-teams without-buttons');
                        this.view.ui.teams.attr('disabled', false);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented without-buttons');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'invites':
                    if (show) {
                        this.hideLeft();
                        this.confirm = 'invites';
                        this.view.$el.find('.broker-list.right-list')
                            .addClass('shown invites-active')
                            .removeClass('presented games-active without-buttons');
                        this.view.ui.confirm.attr('disabled', true);
                    } else {
                        this.confirm = undefined;
                        this.view.$el.find('.broker-list.right-list')
                            .removeClass('shown invites-active');
                        this.destroyCurrentView();
                    }
                    break;
                case 'games':
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
                case 'lineUp':
                    this.view.ui.invite.attr('disabled', true);
                    this.view.ui.confirm.attr('disabled', true);
                    this.view.ui.rightBroker.addClass('team-state');
                    this.view.ui.cancel.attr('disabled', false);
                    this.onGetTeams();
                    break;
                default:
                    break;
            }
        },
        hideLeft: function() {
            if (this.confirm === 'invite' || this.confirm === 'teams') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.left-list').removeClass('shown presented');
                this.destroyCurrentView();
            }
        },
        hideRight: function() {
            if (this.confirm === 'games' || this.confirm === 'invites') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.right-list')
                    .removeClass('shown presented games-active invites-active');
                this.destroyCurrentView();
            }
        },
        showLoader: function() {
            this.view.ui.loader.show();
        },
        hideLoader: function() {
            this.view.ui.loader.hide();
        },
        // Left part
        //users
        onGetUsers: function() {
            if (this.confirm === 'invite') {
                this.switchBrokerState('invite', false);
            } else {
                this.showLoader();
                this.switchBrokerState('invite', true);
                service.getAvailableUsers()
                    .then(function(response){
                        this.hideLoader();
                        if (response.count > 0) {
                            this.showUsersList(response);
                        } else {
                            this.showEmptyList('No users are present.');
                        }
                    }.bind(this), function(err){
                        //TODO error
                    }.bind(this));
            }
        },
        confirmUser: function() {
            this.switchToLineUpState()
                .then(function(team, lineUpName, player){
                    this.afterCandidateSelected(lineUpName, player);
                }.bind(this));
        },
        showUsersList: function(response) {
            var collection = new Backbone.Collection(response.users),
                usersList;

            collection.add({byEmail: true}, {at:0});
            usersList = new UsersList({
                    collection: collection
                });
            this.view.showChildView('leftList', usersList);
            this.listenTo(usersList, 'user:selected', this.onSelectUser.bind(this));
        },
        onSelectUser: function(user, creds, view) {
            if (user.get('byEmail')) {
                if (creds) {
                    this.credentials = _.extend(creds, {
                        callback: this.onInvitationByEmailSent.bind(this, view)
                    });
                    this.view.ui.confirm.attr('disabled', false);
                } else {
                    this.view.ui.confirm.attr('disabled', true);
                }
            } else {
                this.view.ui.confirm.attr('disabled', false);
            }
            this.selectedUser = user;
        },
        afterInvitationSent: function(success, result) {
            if (success) {
                var userName = 'to ' + result.otherUser.user.userName;
                this.publicController.getModalsController().afterInvitationSend(userName)
                    .then(function() {
                        this.reRender();
                    }.bind(this));
            } else {
                //todo manage error
            }
        },
        //invite by email
        onInvitationByEmailSent: function(view, success, result) {
            if (success) {
                var userName = 'to ' + result.otherUser.user.userName;
                this.publicController.getModalsController().afterInvitationSend(userName)
                    .then(function() {
                        this.reRender();
                    }.bind(this));
            } else {
                this.publicController.getModalsController().onError(result);
            }
        },
        //teams
        onGetMyTeams: function() {
            if (this.confirm === 'my_teams') {
                this.switchBrokerState('my_teams', false);
            } else {
                this.switchBrokerState('my_teams', true);
                this.showLoader();
                service.getTeams()
                    .then(function(response){
                        this.hideLoader();
                        this.showMyTeamsList(response);
                    }.bind(this), function(err){

                    }.bind(this));
            }
        },
        showMyTeamsList: function(response) {
            var collection = new Backbone.Collection(response.teams),
                teamsList;
            collection.add({newTeam: true});
            teamsList = new TeamsList({
                collection: collection,
                my_teams: true
            });
            this.view.showChildView('leftList', teamsList);
            //team
            this.listenTo(teamsList, 'team:selected', this.onSelectTeam.bind(this));
            this.listenTo(teamsList, 'team:remove', this.onRemoveTeam.bind(this));
        },
        onGetTeams: function() {
            if (this.confirm === 'teams') {
                this.switchBrokerState('teams', false);
            } else {
                this.switchBrokerState('teams', true);
                this.showLoader();
                service.getTeams()
                    .then(function(response){
                        this.hideLoader();
                        this.showTeamsList(response);
                    }.bind(this), function(err){

                    }.bind(this));
            }
        },
        showTeamsList: function(response) {
            var collection = new Backbone.Collection(response.teams),
                teamsList;
            collection.add({newTeam: true});
            teamsList = new TeamsList({
                collection: collection
            });
            this.view.showChildView('leftList', teamsList);
            //team
            this.listenTo(teamsList, 'team:selected', this.onSelectTeam.bind(this));
            this.listenTo(teamsList, 'team:remove', this.onRemoveTeam.bind(this));
        },

        onSelectTeam: function(team) {
            if (team.get('newTeam')) {
                this.publicController.getCreateTeamController().teamCreate(this.view);
            } else {
                this.selectedTeam = team;
                this.selectedTeam.unset('lineUpId', {silent: true});
                this.view.ui.teamConfirm.attr('disabled', true);
                this.view.ui.confirm.attr('disabled', false);
            }
        },

        onReturnToTeamSelection: function() {
            this.view.$el.removeClass('creation-state');
            this.teamConfirm = undefined;
            if (this.confirm === 'my_teams') {
                this.confirm = undefined;
                this.onGetMyTeams();
            } else {
                this.confirm = undefined;
                this.onGetTeams();
            }
        },

        selectCandidate: function() {
            this.publicController.getCreateTeamController().selectCandidate(this.view, this.selectedTeam);
        },

        onCandidateSelected: function (lineUpName, player) {
            this.invitationDef.resolve(this.selectedTeam, lineUpName, player);
            this.invitationDef = null;
        },

        lineUpShape: function(accept) {
            console.log('switch to broker');
            this.publicController.getGameController().switchToBroker();
            this.view.$el.addClass('creation-state');
            this.publicController.getCreateTeamController().lineUpShape(this.view, accept);
        },

        onRemoveTeam: function(model) {
            var teamName = model.get('displayText'),
                teamUUID = model.get('teamUUID');
            this.publicController.getModalsController().onRemoveTeam(teamName, teamUUID)
                .then(function() {
                    this.onReturnToTeamSelection();
                }.bind(this));
        },

        afterCandidateSelected: function(lineUpName, playerModel) {
            var teamUUID = this.selectedTeam.get('teamUUID'),
                teamId = this.selectedTeam.get('teamId'),
                teamType = this.selectedTeam.get('type').enumText,
                player = {
                    playerId: playerModel.get('playerId'),
                    seasonId: playerModel.get('seasonId'),
                    position: playerModel.get('position').enumText,
                };

            if (this.selectedUser.get('byEmail')) {
                this.publicController.getStateController().onSendInvitationByEmail({
                    callback: this.credentials.callback,
                    email: this.credentials.email,
                    teamUUID: teamUUID,
                    inviteeUID: null,
                    teamId: null,
                    teamType: teamType,
                    lineUpDisplayText: lineUpName,
                    player: player
                });
            } else {
                var inviteeUID = this.selectedUser.get('uid');
                this.publicController.getStateController().onSendInvitation({
                    callback: this.afterInvitationSent.bind(this),
                    inviteeUID: inviteeUID,
                    email: null,
                    teamUUID: null,
                    teamId: teamId,
                    teamType: teamType,
                    lineUpDisplayText: lineUpName,
                    player: player
                });
                this.reRender();
            }
        },

        afterLineUpSelected: function(selectedTeam) {
            var teamId = selectedTeam.get('teamId'),
                teamType = selectedTeam.get('type').enumText,
                lineUpId  = selectedTeam.get('lineUpId');

            if (this.selectedUser.get('byEmail')) {
                this.publicController.getStateController().onSendInvitationByEmail({
                    email: this.credentials.email,
                    callback: this.credentials.callback,
                    teamId: teamId,
                    teamType: teamType,
                    lineUpId: lineUpId
                });
            } else {
                var inviteeUID = this.selectedUser.get('uid');
                this.publicController.getStateController().onSendInvitation({
                    inviteeUID: inviteeUID,
                    teamId: teamId,
                    lineUpId: lineUpId,
                    teamType: teamType,
                    callback: this.afterInvitationSent.bind(this)
                });
                this.reRender();
            }
        },

        // Right part
        //invites
        onGetInvites: function() {
            if (this.confirm === 'invites') {
                this.switchBrokerState('invites', false);
            } else {
                this.showLoader();
                this.switchBrokerState('invites', true);
                service.getMyInvitations()
                    .then(function(response){
                        this.hideLoader();
                        if( response.games.length > 0 ){
                            this.showInvitesList(response);
                        } else {
                            this.showEmptyList('No invitations outstanding.');
                        }
                    }.bind(this), function(err){
                        //TODO error
                    }.bind(this));
            }
        },
        showInvitesList: function(response) {
            var invitesList = new InvitesList({
                collection: new Backbone.Collection(response.games)
            });
            this.view.showChildView('rightList', invitesList);
        },
        //games
        onGetGames: function() {
            if (this.confirm === 'games') {
                this.switchBrokerState('games', false);
            } else {
                this.showLoader();
                this.switchBrokerState('games', true);
                service.getMyGames()
                    .then(function(response){
                        this.hideLoader();
                        if( response.games.length > 0 ){
                            this.showGamesList(response);
                        } else {
                            this.showEmptyList('No active or paused games.');
                        }
                    }.bind(this), function(err){
                        //TODO error
                    }.bind(this));
            }
        },
        confirmGame: function() {
            var gameUUID = this.selectedGame.get('gameUUID'),
                state = this.selectedGame.get('state');
            if (state === 'RUNNING') {
                this.publicController.getStateController().notifyOpponentOfGameResumption(gameUUID);
            } else {
                this.publicController.getStateController().refreshStatus(gameUUID);
            }
            this.reRender();
        },
        showGamesList: function(response) {
            var gamesList = new GamesList({
                collection: new Backbone.Collection(response.games)
            });
            this.view.showChildView('rightList', gamesList);
            this.listenTo(gamesList, 'game:selected', this.onSelectGame.bind(this));
        },
        onSelectGame: function(game) {
            this.selectedGame = game;
            this.view.ui.confirm.attr('disabled', false);
        },
        //confirm
        onConfirm: function() {
            switch (this.confirm) {
                case 'invite':
                    this.confirmUser();
                    break;
                case 'games':
                    this.confirmGame();
                    break;
                case 'teams':
                    if (this.invitationDef) {
                        this.selectCandidate();
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
            //TODO maybe return to previous step
            //and same when team created
        },

        onTeamConfirm: function() {
            this.view.ui.invite.attr('disabled', true);
            this.invitationDef.resolve(this.selectedTeam);
            this.invitationDef = null;
        },

        switchToLineUpState: function() {
            this.switchBrokerState('lineUp', true);
            this.invitationDef = $.Deferred();
            return this.invitationDef;
        },
        
        retrivePinchHit: function(){
             this.publicController.getGameController().setPinchHitter();
             
             this.publicController.getpinchHitterController().retrivePinchHit(this.view);
					},
    });

    return new BrokerController();
});
