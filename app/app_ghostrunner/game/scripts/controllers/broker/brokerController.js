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
    '../../views/partials/invitationForm',
    '../../APIGateway/gameService'
    ], function(Vent, appCache, MainBrokerView, TeamsList, UsersList, GamesList, EmptyListView, InvitationFormView, service){
    var BrokerController = Mn.Object.extend({
        create: function(layout, region) {
            this.view = new MainBrokerView();
            layout.showChildView( region, this.view );
            this.listenTo(this.view, 'getTeams', this.onGetTeams.bind(this));
            this.listenTo(this.view, 'getUsers', this.onGetUsers.bind(this));
            this.listenTo(this.view, 'inviteByEmail', this.onInviteByEmail.bind(this));
            this.listenTo(this.view, 'getGames', this.onGetGames.bind(this));
            this.listenTo(this.view, 'confirm', this.onConfirm.bind(this));
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
            var currentView = this.view.getRegion('rightList').currentView;
            if (currentView) currentView.destroy();
        },
        //teams
        onGetTeams: function() {
            service.getTeams()
                .then(function(response){
                   //TODO teams list
                    if (response.length === 0) {
                        response = [
                            {
                                teamName: 'team1',
                                teamId: 0
                            },
                            {
                                teamName: 'team2',
                                teamId: 1
                            },
                            {
                                teamName: 'team3',
                                teamId: 2
                            },
                            {
                                teamName: 'team4',
                                teamId: 3
                            },
                            {
                                teamName: 'team5',
                                teamId: 4
                            }
                        ];
                    }
                    this.showTeamsList(response);
                }.bind(this), function(err){
                    
                }.bind(this));
        },
        showTeamsList: function(response) {
            var teamsList = new TeamsList({
                collection: new Backbone.Collection(response)
            });
            this.view.showChildView('leftList', teamsList);
            this.listenTo(teamsList, 'team:selected', this.onSelectTeam.bind(this));
            this.view.$el.find('.broker-list.left-list')
                .addClass('shown presented');
        },
        onSelectTeam: function(team) {
            this.selectedTeam = team;
            this.view.ui.teamConfirm.attr('disabled', false);
        },
        //users
        onGetUsers: function() {
            if (this.confirm === 'users') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.right-list').removeClass('shown presented');
                this.destroyCurrentView();
            } else {
                this.publicController.getInterfaceController().showLoader();
                service.getAvailableUsers()
                    .then(function(response){
                        this.publicController.getInterfaceController().hideLoader();
                        if (response.count > 0) {
                            this.showUsersList(response);
                        } else {
                            this.view.$el.find('.broker-list.right-list')
                                .removeClass('presented games-active byemail-active');
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
            var inviteeUID = this.selectedUser.get('uid'),
                teamId = this.selectedTeam.get('teamId');
            this.publicController.getStateController().onSendInvitation(inviteeUID, teamId);
            this.reRender();
        },
        showUsersList: function(response) {
            var usersList = new UsersList({
                collection: new Backbone.Collection(response.users)
            });
            this.view.showChildView('rightList', usersList);
            this.listenTo(usersList, 'user:selected', this.onSelectUser.bind(this));
            this.view.$el.find('.broker-list.right-list')
                .addClass('shown presented').removeClass('games-active byemail-active');
        },
        onSelectUser: function(user) {
            this.selectedUser = user;
            this.view.ui.confirm.attr('disabled', false);
        },
        //invite by email
        onInviteByEmail: function() {
            if (this.confirm === 'byemail') {
                this.confirm = undefined;
                this.view.$el.find('.broker-list.right-list').removeClass('shown presented byemail-active');
                this.destroyCurrentView();
            } else {
                this.publicController.getInterfaceController().showLoader();
                this.showByEmailForm();
                this.confirm = 'byemail';
                this.view.ui.confirm.attr('disabled', true);
            }
        },
        showByEmailForm: function() {
            var invitationForm = new InvitationFormView();
            this.view.showChildView('rightList', invitationForm);
            this.listenTo(invitationForm, 'credentials:filled', this.onInvitationFilled.bind(this, invitationForm));
            this.view.$el.find('.broker-list.right-list')
                .addClass('shown presented byemail-active').removeClass('game-active');
        },
        onInvitationFilled: function(view, credentials) {
            if (credentials) {
                this.view.ui.confirm.attr('disabled', false);
            } else {
                this.view.ui.confirm.attr('disabled', true);
            }
            this.credentials = _.extend(credentials, {
                callback: this.onInvitationByEmailSent.bind(this, view)
            });
        },
        confirmInvitationByEmail: function() {
            var teamId = this.selectedTeam.get('teamId');
            this.publicController.getStateController().onSendInvitationByEmail(this.credentials, teamId);
        },
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
                service.getMyGames()
                    .then(function(response){
                        this.publicController.getInterfaceController().hideLoader();
                        if( response.games.length > 0 ){
                            this.showGamesList(response);
                        } else {
                            this.view.$el.find('.broker-list.right-list')
                                .removeClass('presented').addClass('games-active');
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
                .addClass('shown presented games-active').removeClass('byemail-active');
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
                case 'byemail':
                    this.confirmInvitationByEmail();
                    break;
                case 'games':
                    this.confirmGame();
                    break;
                default:
                    break;
            }
        },

        onTeamConfirm: function() {
            this.view.ui.invite.attr('disabled', false);
            this.view.ui.byemail.attr('disabled', false);
        }
    });

    return new BrokerController();
});
