/*global define */

'use strict';

define([
    '../../appCache',
    '../../views/mainBroker',
    '../../views/partials/teamsList',
    '../../views/partials/lineupsList',
    '../../views/partials/usersList',
    '../../views/partials/gamesList',
    '../../views/partials/invitesList',
    '../../views/partials/emptyList',
    '../../APIGateway/gameService'
    ], function(appCache, MainBrokerView, TeamsList, LineupsList, UsersList, GamesList, InvitesList, EmptyListView, service){
    var BrokerController = Mn.Object.extend({
        create: function(layout, region) {
            this.view = new MainBrokerView();
            layout.showChildView( region, this.view );
            this.listenTo(this.view, 'getTeams', this.onGetMyTeams.bind(this));
            this.listenTo(this.view, 'getLineups', this.onGetMyLineups.bind(this));
            this.listenTo(this.view, 'getUsers', this.onGetUsers.bind(this));
            this.listenTo(this.view, 'getInvites', this.onGetInvites.bind(this));
            this.listenTo(this.view, 'getGames', this.onGetGames.bind(this));
            this.listenTo(this.view, 'confirm', this.onConfirm.bind(this));
            this.listenTo(this.view, 'cancel', this.onCancel.bind(this));
            this.listenTo(this.view, 'team:confirm', this.onTeamConfirm.bind(this));
            this.listenTo(this.view, 'brokerClicked', this.onBrokerClicked.bind(this));
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
        showEmptyList: function(where, message) {
            var emptyList = new EmptyListView({
                model: new Backbone.Model({message: message})
            });
            this.view.showChildView(where, emptyList);
        },
        destroyCurrentView: function() {
            var currentView = this.view.getRegion('rightList').currentView ||
                this.view.getRegion('leftList').currentView;
            if (currentView) {
                currentView.destroy();
            }
        },

        onBrokerClicked: function() {
            //close some menus on broker area click
            if (this.confirm === 'invite' ||
                this.confirm === 'my_teams' ||
                this.confirm === 'my_lineups' ||
                this.confirm === 'games' ||
                this.confirm === 'invites') {
                this.switchBrokerState(this.confirm, false);
            }
            return true;
        },
        switchBrokerState: function(state, show) {
            switch(state) {
                //on invite user
                case 'invite':
                    if (show) {
                        this.hideRight();
                        this.confirm = 'invite';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented').removeClass('my-teams my-invites without-buttons');
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
                            .removeClass('my-lineups without-buttons');
                        this.view.ui.teams.attr('disabled', false)
                            .addClass('inactive');
                        this.view.ui.lineups.removeClass('inactive');
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
                            .addClass('shown presented my-teams without-buttons')
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
                            .removeClass('my-teams without-buttons');
                        this.view.ui.lineups.attr('disabled', false)
                            .addClass('inactive');
                        this.view.ui.teams.removeClass('inactive');
                        this.view.ui.confirm.attr('disabled', true);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented');
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
                            .removeClass('my-teams');
                        this.view.ui.teams.attr('disabled', false);
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented without-buttons');
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
                            .removeClass('games-active without-buttons');
                        this.view.ui.confirm.attr('disabled', true);
                    } else {
                        this.confirm = undefined;
                        this.view.$el.find('.broker-list.right-list')
                            .removeClass('shown presented invites-active');
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
                case 'lineUpSelection':
                    //for switch state to teams
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
            if (this.confirm === 'invite' ||
                this.confirm === 'my_teams' ||
                this.confirm === 'my_lineups') {

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
                            this.showEmptyList('leftList', 'No users are present.');
                        }
                    }.bind(this), function(xhr){
                        this.hideLoader();
                        this.switchBrokerState('invite', false);
                        this.publicController.getModalsController().apiErrorPopup(xhr);
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
            var switchToState = 'my_teams';
            if (this.confirm === switchToState) {
                this.switchBrokerState(switchToState, false);
            } else {
                if (this.confirm === 'lineups') {
                    switchToState = 'teams';
                }
                this.switchBrokerState(switchToState, true);
                this.showLoader();
                service.getTeams()
                    .then(function(response){
                        this.hideLoader();
                        this.showMyTeamsList(switchToState, response);
                    }.bind(this), function(xhr){
                        this.hideLoader();
                        this.switchBrokerState('my_teams', false);
                        this.publicController.getModalsController().apiErrorPopup(xhr);
                    }.bind(this));
            }
        },
        showMyTeamsList: function(switchToState, response) {
            var collection = new Backbone.Collection(response.teams),
                teamsList;
            collection.add({newTeam: true});
            teamsList = new TeamsList({
                collection: collection,
                state: switchToState
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
                    }.bind(this), function(xhr){
                        this.hideLoader();
                        this.switchBrokerState('teams', false);
                        this.reRender();
                        this.publicController.getModalsController().apiErrorPopup(xhr);
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

        lineUpShape: function(accept, starterPlayer) {
            console.log('switch to broker');
            this.publicController.getGameController().switchToBroker();
            this.view.$el.addClass('creation-state');
            //manage standard invitation scenarion (starter -> then lineup)
            // or full lineup with starter creation
            // and role selection
            if (starterPlayer) {
                this.publicController.getCreateTeamController().lineUpFullShape(this.view, accept, this.selectedTeam, starterPlayer);
            } else {
                this.publicController.getCreateTeamController().lineUpShape(this.view, accept);
            }
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
                    leagueId: playerModel.get('leagueId'),
                    playerRoleId: playerModel.get('playerRoleId'),
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

        //standard selection scenario
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
        //my lineups
        onGetMyLineups: function() {
            var switchToState = 'my_lineups';
            if (this.confirm === switchToState) {
                this.switchBrokerState(switchToState, false);
            } else {
                if (this.confirm === 'teams') {
                    switchToState = 'lineups'
                }
                this.switchBrokerState(switchToState, true);
                this.showLoader();
                service.getMyLineups()
                    .then(function(response){
                        this.hideLoader();
                        if( response.lineups.length > 0 ){
                            this.showMyLineupsList(switchToState, response);
                        } else {
                            this.showEmptyList('leftList', 'No lineups created.');
                        }
                    }.bind(this), function(xhr){
                        this.hideLoader();
                        this.switchBrokerState('my_lineups', false);
                        this.reRender();
                        this.publicController.getModalsController().apiErrorPopup(xhr);
                    }.bind(this));
            }
        },

        showMyLineupsList: function(switchToState, response) {
            var collection = new Backbone.Collection(response.lineups),
                lineupsList;
            lineupsList = new LineupsList({
                collection: collection,
                state: switchToState
            });
            this.view.showChildView('leftList', lineupsList);
            //lineups
            this.listenTo(lineupsList, 'lineup:selected', this.onSelectLineup.bind(this));
        },

        onSelectLineup: function(lineup) {
            this.selectedLineup = lineup;
            this.view.ui.confirm.attr('disabled', false);
        },

        //user lineup selection scenario
        onLineupSelected: function() {
            var game = appCache.get('game'),
                lineupId = this.selectedLineup.get('lineUpId'),
                teamId = this.selectedLineup.get('teamId');

            if (game) {
                //after invitation accepted
                this.publicController.getModalsController().onSelectRole()
                    .then(function(role) {
                        this.publicController.getStateController().onSelectLineupAndAccept({
                            teamId: teamId,
                            lineupId: lineupId
                        }, role);
                    }.bind(this));
            } else {
                //on user invitation step
                if (this.selectedUser.get('byEmail')) {
                    this.publicController.getStateController().onSendInvitationByEmailWithUserLineup({
                        callback: this.credentials.callback,
                        email: this.credentials.email,
                        teamId: teamId,
                        lineupId: lineupId
                    });
                } else {
                    var inviteeUID = this.selectedUser.get('uid');
                    this.publicController.getStateController().onSendInvitationWithUserLineup({
                        callback: this.afterInvitationSent.bind(this),
                        inviteeUID: inviteeUID,
                        teamId: teamId,
                        lineupId: lineupId
                    });
                    this.reRender();
                }
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
                            this.showEmptyList('rightList', 'No invitations outstanding.');
                        }
                    }.bind(this), function(xhr){
                        this.hideLoader();
                        this.switchBrokerState('invites', false);
                        this.publicController.getModalsController().apiErrorPopup(xhr);
                    }.bind(this));
            }
        },
        showInvitesList: function(response) {
            var invitesList = new InvitesList({
                collection: new Backbone.Collection(response.games)
            });
            this.view.showChildView('rightList', invitesList);
            this.listenTo(invitesList, 'invitation:selected', this.onSelectInvitation.bind(this));
        },
        onSelectInvitation: function(invitation) {
            this.selectedGame = invitation;
            this.view.ui.confirm.attr('disabled', false);
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
                            this.showEmptyList('rightList', 'No active or paused games.');
                        }
                    }.bind(this), function(xhr){
                        this.hideLoader();
                        this.switchBrokerState('games', false);
                        this.publicController.getModalsController().apiErrorPopup(xhr);
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

        switchToLineUpState: function() {
            this.switchBrokerState('lineUpSelection', true);
            this.invitationDef = $.Deferred();
            return this.invitationDef;
        },

        playerReplacementMode: function(action){
            this.publicController.getGameController().setPlayerReplacementState();

            this.publicController.getPlayerReplacementController().managePlayerReplacement(this.view, action);
		},

        showInvitesNumber: function(number) {
            this.view.triggerMethod('showInvitesNumber', number);
        },

        onPlayerCardShow: function() {
            //show opponent starter players card
            var gameModel = appCache.get('game'),
                otherLineUp = gameModel.get('otherLineUp'),
                player = otherLineUp.players[0];
            service.retrievePlayerCard({
                playerId: player.playerId,
                seasonId: player.seasonId,
                leagueId: player.leagueId,
                playerRoleId: player.playerRoleId,
                position: player.position.enumText
            }).then(function(card) {
                this.publicController.getChoiceController().showPlayersCard(card)
                    .then(function() {
                        if (gameModel.get('thisUser').initiator) {
                            this.publicController.getModalsController().beforeLineUpShape(gameModel);
                        } else {
                            this.publicController.getModalsController().onInvitationConfirmed(gameModel);
                        }
                    }.bind(this));
            }.bind(this), function(xhr){
                this.publicController.getModalsController().apiErrorPopup(xhr);
            }.bind(this));
        }
    });

    return new BrokerController();
});
