/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../views/mainBroker',
    '../../views/partials/teamsList',
    '../../views/partials/usersList',
    '../../views/partials/gamesList',
    '../../views/partials/emptyList',
    '../../APIGateway/gameService'
    ], function(Vent, appCache, MainBrokerView, TeamsList, UsersList, GamesList, EmptyListView, service){
    var BrokerController = Mn.Object.extend({
        create: function(layout, region) {
            this.view = new MainBrokerView();
            layout.showChildView( region, this.view );
            this.listenTo(this.view, 'getTeams', this.onGetTeams.bind(this));
            this.listenTo(this.view, 'getUsers', this.onGetUsers.bind(this));
            this.listenTo(this.view, 'getGames', this.onGetGames.bind(this));
            this.listenTo(this.view, 'confirm', this.onConfirm.bind(this));
            this.listenTo(this.view, 'cancel', this.onCancel.bind(this));
            this.listenTo(this.view, 'team:confirm', this.onTeamConfirm.bind(this));
            this.checkGameUrlUUID();
        },
        reRender: function () {
            this.confirm = undefined;
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
        //teams
        onGetTeams: function() {
            if (this.teamConfirm) {
                this.teamConfirm = undefined;
                this.view.$el.find('.broker-list.left-list').removeClass('shown presented');
                this.destroyCurrentView();
            } else {
                this.teamConfirm = true;
                this.hideRight();
                service.getTeams()
                    .then(function(response){
                        this.showTeamsList(response);
                    }.bind(this), function(err){
                        
                    }.bind(this));
            }
        },
        hideTeams: function() {
            if (this.teamConfirm) {
                this.teamConfirm = undefined;
                this.view.$el.find('.broker-list.left-list').removeClass('shown presented');
                this.destroyCurrentView();
            }
        },
        hideRight: function() {
            if (this.confirm === 'games' || this.confirm === 'users') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.right-list')
                    .removeClass('shown presented games-active');
                this.destroyCurrentView();
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
            this.listenTo(teamsList, 'team:edit', this.onEditTeam.bind(this));
            //lineup
            this.listenTo(teamsList, 'lineUp:selected', this.onSelectLineUp.bind(this));
            this.listenTo(teamsList, 'lineUp:remove', this.onRemoveLineUp.bind(this));
            this.listenTo(teamsList, 'lineUp:edit', this.onEditLineUp.bind(this));

            this.view.$el.find('.broker-list.left-list')
                .addClass('shown presented');
        },

        onSelectTeam: function(team) {
            if (team.get('newTeam')) {
                this.publicController.getCreateTeamController().teamCreate(this.view);
            } else {
                this.selectedTeam = team;
                this.selectedTeam.unset('lineUpId', {silent: true});
                this.view.ui.teamConfirm.attr('disabled', true);
            }
        },

        onSelectLineUp: function(lineUpId) {
            if (lineUpId === 'new') {
                this.publicController.getCreateTeamController().lineUpCreate(this.view, this.selectedTeam);
            } else {
                this.selectedTeam.set('lineUpId', lineUpId, {silent: true});
                this.view.ui.teamConfirm.attr('disabled', false);
            }
        },

        onRemoveTeam: function(model) {
            var teamName = model.get('displayText');
            this.publicController.getChoiceController().showConfirmation({
                message: 'Are you sure you want to delete ' + teamName +' team?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                //todo delete request
            }.bind(this), function() {
                
            }.bind(this));
        },

        onRemoveLineUp: function(lineUp) {
            var lineUpName = lineUp.displayText;
            this.publicController.getChoiceController().showConfirmation({
                message: 'Are you sure you want to delete ' + lineUpName +' lineUp?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                //todo delete request
            }.bind(this), function() {
                
            }.bind(this));
        },

        onEditTeam: function(model) {
            var teamId = model.get('teamId');
            //todo need API for that
        },

        onEditLineUp: function(lineUp) {
            var lineUpId = lineUp.lineUpId;
            //todo need API for that
        },

        afterLineUpSelected: function() {
            var teamId = this.selectedTeam.get('teamId'),
                lineUpId  = this.selectedTeam.get('lineUpId');

            if (this.selectedUser.get('byEmail')) {
                this.publicController.getStateController().onSendInvitationByEmail({
                    email: this.credentials.email,
                    callback: this.credentials.callback,
                    teamId: teamId,
                    lineUpId: lineUpId
                });
            } else {
                var inviteeUID = this.selectedUser.get('uid');
                this.publicController.getStateController().onSendInvitation({
                    inviteeUID: inviteeUID, 
                    teamId: teamId,
                    lineUpId: lineUpId,
                    callback: this.afterInvitationSent.bind(this)
                });
                this.reRender();
            }
        },

        //users
        onGetUsers: function() {
            if (this.confirm === 'users') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.right-list').removeClass('shown presented');
                this.destroyCurrentView();
            } else {
                this.publicController.getInterfaceController().showLoader();
                this.hideTeams();
                service.getAvailableUsers()
                    .then(function(response){
                        this.publicController.getInterfaceController().hideLoader();
                        if (response.count > 0) {
                            this.showUsersList(response);
                        } else {
                            this.view.$el.find('.broker-list.right-list')
                                .removeClass('presented games-active');
                            this.showEmptyList('No users are presented.');
                        }
                    }.bind(this), function(err){
                        //TODO error
                    }.bind(this));
                this.confirm = 'users';
                this.view.ui.confirm.attr('disabled', true);
            }
        },
        confirmUser: function() {
            this.switchToTeamState();
        },
        showUsersList: function(response) {
            var collection = new Backbone.Collection(response.users),
                usersList;

            collection.add({byEmail: true}, {at:0});
            usersList = new UsersList({
                    collection: collection
                });
            this.view.showChildView('rightList', usersList);
            this.listenTo(usersList, 'user:selected', this.onSelectUser.bind(this));
            this.view.$el.find('.broker-list.right-list')
                .addClass('shown presented').removeClass('games-active');
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
                this.publicController.getChoiceController().showConfirmation({
                    message: 'Your invitation ' + userName + ' successfully sent.',
                    confirm: 'ok'
                }).then(function() {
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
                this.publicController.getChoiceController().showConfirmation({
                    message: 'Your invitation ' + userName + ' successfully sent.',
                    confirm: 'ok'
                }).then(function() {
                    this.reRender();
                }.bind(this));
            } else {
                view.triggerMethod('error', result);
            }
        },
        //games
        onGetGames: function() {
            if (this.confirm === 'games') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.right-list')
                    .removeClass('shown presented games-active');
                this.destroyCurrentView();
            } else {
                this.publicController.getInterfaceController().showLoader();
                this.hideTeams();
                service.getMyGames()
                    .then(function(response){
                        this.publicController.getInterfaceController().hideLoader();
                        if( response.games.length > 0 ){
                            this.showGamesList(response);
                        } else {
                            this.view.$el.find('.broker-list.right-list')
                                .addClass('shown presented games-active');
                            this.showEmptyList('No games are presented.');
                        }
                    }.bind(this), function(err){
                        //TODO error
                    }.bind(this));
                this.confirm = 'games';
                this.view.ui.confirm.attr('disabled', true);
            }
        },
        confirmGame: function() {
            var gameUUID = this.selectedGame.get('gameUUID'),
                state = this.selectedGame.get('state');

            this.publicController.getStateController().refreshStatus(gameUUID);
            this.reRender();
        },
        showGamesList: function(response) {
            var gamesList = new GamesList({
                collection: new Backbone.Collection(response.games)
            });
            this.view.showChildView('rightList', gamesList);
            this.listenTo(gamesList, 'game:selected', this.onSelectGame.bind(this));
            this.view.$el.find('.broker-list.right-list')
                .addClass('shown presented games-active');
        },
        onSelectGame: function(game) {
            this.selectedGame = game;
            this.view.ui.confirm.attr('disabled', false);
        },
        //confirm
        onConfirm: function() {
            switch (this.confirm) {
                case 'users':
                    this.confirmUser();
                    break;
                case 'games':
                    this.confirmGame();
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
        },

        onTeamConfirm: function() {
            this.view.ui.invite.attr('disabled', true);
            this.afterLineUpSelected();
        },

        switchToTeamState: function() {
            this.view.ui.rightBroker.addClass('team-state');
            this.view.ui.cancel.attr('disabled', false);
        }
    });

    return new BrokerController();
});
