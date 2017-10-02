/*global define */

'use strict';

define([
    '../../appCache',
    './brokerStateMixin',
    '../../views/mainBroker',
    '../../views/partials/teamsList',
    '../../views/partials/lineupsList',
    '../../views/partials/usersList',
    '../../views/partials/gamesList',
    '../../views/partials/invitesList',
    '../../views/partials/emptyList',
    '../../APIGateway/gameService'
    ], function(appCache, brokerStateMixin, MainBrokerView, TeamsList,
                LineupsList, UsersList, GamesList, InvitesList, EmptyListView,
                service) {
    var BrokerController = Mn.Object.extend({
        initialize: function() {
            _.extend(this, brokerStateMixin); //extend switch state
        },
        create: function(layout, region) {
            this.view = new MainBrokerView();
            layout.showChildView( region, this.view );
            this.listenToView();
            this.checkGameUrlUUID();
        },
        listenToView: function() {
            this.listenTo(this.view, 'getTeams', this.onGetMyTeams.bind(this));
            this.listenTo(this.view, 'getLineups', this.onGetMyLineups.bind(this));
            this.listenTo(this.view, 'getUsers', this.onGetUsers.bind(this));
            this.listenTo(this.view, 'getInvites', this.onGetInvites.bind(this));
            this.listenTo(this.view, 'getGames', this.onGetGames.bind(this));
            this.listenTo(this.view, 'confirm', this.onConfirm.bind(this));
            this.listenTo(this.view, 'cancel', this.onCancel.bind(this));
            this.listenTo(this.view, 'team:confirm', this.onTeamConfirm.bind(this));
            this.listenTo(this.view, 'lineup:create', this.onLineupCreate.bind(this));
            this.listenTo(this.view, 'brokerClicked', this.onBrokerClicked.bind(this));
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

        destroyCurrentView: function() {
            var currentView = this.view.getRegion('rightList').currentView ||
                this.view.getRegion('leftList').currentView;
            if (currentView) {
                currentView.destroy();
            }
        },

        //empty list
        showEmptyList: function(where, message) {
            var emptyList = new EmptyListView({
                model: new Backbone.Model({message: message})
            });
            this.view.showChildView(where, emptyList);
        },

        // Left part !!!

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
            this.switchToStarterState()
                .then(function(team, player){
                    this.afterCandidateSelected(player);
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

        onReturnToLineupSelection: function(accept) {
            this.view.$el.removeClass('creation-state');
            this.teamConfirm = undefined;
            if (this.confirm === 'lineups') {
                this.lineUpChoose(accept);
            }
        },

        selectCandidate: function() {
            this.publicController.getCreateTeamController().selectCandidate(this.view, this.selectedTeam);
        },

        onCandidateSelected: function (player) {
            this.invitationDef.resolve(this.selectedTeam, player);
            this.invitationDef = null;
        },

        lineUpChoose: function(accept) {
            console.log('switch to broker');
            this.publicController.getGameController().switchToBroker();
            this.switchToLineUpState().then(function(){
                this.publicController.getCreateTeamController().lineUpShape(this.view, accept);
            }.bind(this));
        },

        onLineupCreate: function() {
            this.invitationDef.resolve();
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

        afterCandidateSelected: function(playerModel) {
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
                if (this.confirm === 'beforeLineups') {
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
                            // this.showEmptyList('leftList', 'No lineups created.');
                            this.disableLineUps();
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
                if (game.get('thisUser').initiator) {
                    this.publicController.getStateController().onSelectRemainingLineUpById({
                        teamId: teamId,
                        lineupId: lineupId
                    });
                } else {
                    this.publicController.getModalsController().onSelectRole()
                        .then(function(role) {
                            this.publicController.getStateController().onSelectRemainingLineUpByIdAndAccept({
                                teamId: teamId,
                                lineupId: lineupId,
                                preferredRole: role
                            });
                        }.bind(this));
                }
            }
        },
        // end of left part !!!

        // Right part !!!

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
                /* do nothing */
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

        //end of right part !!!

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
