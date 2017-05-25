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
        switchBrokerState: function(state, show) {
            switch(state) {
                case 'invite':
                    if (show) {
                        this.hideRight();
                        this.confirm = 'invite';
                        this.view.$el.find('.broker-list.left-list')
                            .addClass('shown presented').removeClass('my-teams');
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
                            .addClass('shown presented my-teams');
                    } else {
                        this.view.$el.find('.broker-list.left-list')
                            .removeClass('shown presented');
                        this.confirm = undefined;
                        this.destroyCurrentView();
                    }
                    break;
                case 'games':
                    if (show) {
                        this.hideLeft();
                        this.confirm = 'games';
                        this.view.$el.find('.broker-list.right-list')
                            .addClass('shown presented games-active');
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
            if (this.confirm === 'games') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.right-list')
                    .removeClass('shown presented games-active');
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
                            this.showEmptyList('No users are presented.');
                        }
                    }.bind(this), function(err){
                        //TODO error
                    }.bind(this));
            }
        },
        confirmUser: function() {
            this.switchToLineUpState()
                .then(function(selectedTeam){
                    this.afterLineUpSelected(selectedTeam);
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
        //teams
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
            this.listenTo(teamsList, 'team:edit', this.onEditTeam.bind(this));
            //lineup
            this.listenTo(teamsList, 'lineUp:selected', this.onSelectLineUp.bind(this));
            this.listenTo(teamsList, 'lineUp:remove', this.onRemoveLineUp.bind(this));
            this.listenTo(teamsList, 'lineUp:edit', this.onEditLineUp.bind(this));
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
                service.deleteTeam(model.get('teamUUID'))
                    .then(this.afterTeamRemoved.bind(this, teamName));
            }.bind(this), function() {
                
            }.bind(this));
        },

        afterTeamRemoved: function(teamName) {
            this.publicController.getChoiceController().showConfirmation({
                message: 'Team ' + teamName + ' succesfully removed.',
                confirm: 'ok'
            }).then(function() {
                this.onCancel();
            }.bind(this));
            console.log('team removed');
        },

        onRemoveLineUp: function(lineUp) {
            var lineUpName = lineUp.displayText;
            this.publicController.getChoiceController().showConfirmation({
                message: 'Are you sure you want to delete ' + lineUpName +' lineUp?',
                cancel: 'cancel',
                confirm: 'confirm'
            }).then(function(){
                service.deleteLineUp(this.selectedTeam.get('teamUUID'), lineUp.lineUpId)
                    .then(this.afterLineUpRemoved.bind(this, lineUpName));
            }.bind(this), function() {
                
            }.bind(this));
        },

        afterLineUpRemoved: function(lineUpName) {
            this.publicController.getChoiceController().showConfirmation({
                message: 'LineUp ' + lineUpName + ' succesfully removed.',
                confirm: 'ok'
            }).then(function() {
                this.onCancel();
            }.bind(this));
            console.log('team removed');
        },

        onEditTeam: function(model) {
            this.publicController.getCreateTeamController().teamEdit(this.view, model);
        },

        onEditLineUp: function(model, lineUp) {
            this.publicController.getCreateTeamController().lineUpEdit(this.view, model, lineUp);
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
                            this.showEmptyList('No games are presented.');
                        }
                    }.bind(this), function(err){
                        //TODO error
                    }.bind(this));
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
            this.invitationDef.resolve(this.selectedTeam);
        },

        switchToLineUpState: function() {
            this.switchBrokerState('lineUp', true);
            this.invitationDef = $.Deferred();
            return this.invitationDef;
        }
    });

    return new BrokerController();
});
