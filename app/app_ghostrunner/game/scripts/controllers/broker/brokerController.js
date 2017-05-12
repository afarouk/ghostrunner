/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../views/mainBroker',
    '../../views/partials/playersList',
    '../../views/partials/gamesList',
    '../../views/partials/emptyList',
    '../../APIGateway/gameService'
    ], function(Vent, appCache, MainBrokerView, PlayersList, GamesList, EmptyListView, service){
    var BrokerController = Mn.Object.extend({
        create: function(layout, region) {
            this.view = new MainBrokerView();
            layout.showChildView( region, this.view );
            this.listenTo(this.view, 'getPlayers', this.onGetPlayers.bind(this));
            this.listenTo(this.view, 'getGames', this.onGetGames.bind(this));
            this.listenTo(this.view, 'confirm', this.onConfirm.bind(this));
        },
        reRender: function () {
            this.view.render();
        },
        //empty list
        showEmptyList: function(message) {
            var emptyList = new EmptyListView({
                model: new Backbone.Model({message: message})
            });
            this.view.showChildView('rightList', emptyList);
        },
        //players
        onGetPlayers: function() {
            this.publicController.getInterfaceController().showLoader();
            service.getAvailableUsers()
                .then(function(response){
                    this.publicController.getInterfaceController().hideLoader();
                    if (response.count > 0) {
                        this.showPlayersList(response);
                    } else {
                        this.view.$el.find('.broker-list.right-list')
                            .removeClass('presented').removeClass('games-active');
                        this.showEmptyList('No users are presented.');
                    }
                }.bind(this), function(err){
                    //TODO error
                }.bind(this));
            this.confirm = 'players';
            this.view.ui.confirm.attr('disabled', true);
        },
        confirmPlayer: function() {
            var inviteeUID = this.selectedPlayer.get('uid');
            this.publicController.getStateController().onSendInvitation(inviteeUID);
            this.reRender();
        },
        showPlayersList: function(response) {
            var playersList = new PlayersList({
                collection: new Backbone.Collection(response.users)
            });
            this.view.showChildView('rightList', playersList);
            this.listenTo(playersList, 'player:selected', this.onSelectPlayer.bind(this));
            this.view.$el.find('.broker-list.right-list').addClass('shown presented').removeClass('games-active');
        },
        onSelectPlayer: function(player) {
            this.selectedPlayer = player;
            this.view.ui.confirm.attr('disabled', false);
        },
        //games
        onGetGames: function() {
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
        },
        confirmGame: function() {
            var gameUUID = this.selectedGame.get('gameUUID'),
                state = this.selectedGame.get('state');

            if ( state === "ACCEPTED") {
                this.publicController.getStateController().startGame(gameUUID);
            } else if (state === "PAUSED") {
                this.publicController.getStateController().unPauseGame(gameUUID);
            } else {
                this.publicController.getStateController().refreshStatus(gameUUID);
            }
        },
        showGamesList: function(response) {
            var gamesList = new GamesList({
                collection: new Backbone.Collection(response.games)
            });
            this.view.showChildView('rightList', gamesList);
            this.listenTo(gamesList, 'game:selected', this.onSelectGame.bind(this));
            this.view.$el.find('.broker-list.right-list').addClass('shown presented').addClass('games-active');
        },
        onSelectGame: function(game) {
            this.selectedGame = game;
            this.view.ui.confirm.attr('disabled', false);
        },
        //confirm
        onConfirm: function() {
            if (this.confirm === 'players') {
                this.confirmPlayer();
            } else if (this.confirm === 'games') {
                this.confirmGame();
            }
        }
    });

    return new BrokerController();
});
