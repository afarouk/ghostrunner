/*global define */

'use strict';

define([
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/partials/pinchLineUpCreation',
    '../../views/partials/selectCandidate',
    '../../models/playersCollection'
    ], function(appCache, service, PinchLineUpCreation, SelectCandidateView, PlayersCollection){
    var pinchHitterController = Mn.Object.extend({

        retrivePinchHit:function(layout){
            var game = appCache.get('game'),
                lineUp = new Backbone.Model(appCache.get('thisLineUp'));
            service.retrievePinchHitterChoices(lineUp)
                .then(function(players){
                    this.onShapeLineUp(players, lineUp);
                }.bind(this), function(xhr){
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },

        onShapeLineUp: function(players, starterLineUp) {
            this.players = players;
            var createData = {
                    players: (new PlayersCollection()).getLineUps(players.currentLineup),
                    availableplayers: (new PlayersCollection()).getAvailablePlayers(players.availablePlayers),
                    headings: players.lineUpHeadings,
                    title: 'Select replacement for batter (pinch hitter)'
                },
                lineUpCreation = new PinchLineUpCreation(createData);
            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpCreation);
            this.listenTo(lineUpCreation, 'lineUp:save', this.onLineUpSave.bind(this));
        },

        onLineUpSave: function(playersParams){
            var game = appCache.get('game');

            service.setPinchHitter(playersParams).then(function(result){
                this.publicController.getModalsController().afterSaveRequest().then(function(){
                    this.backInGame( game.get('gameUUID') , result.state);
                }.bind(this), function(xhr){
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            }.bind(this));
        },
        backInGame: function( gameUUID , state) {
            this.publicController.getStateController().refreshStatus(gameUUID);
            this.publicController.getGameController().switchToGame();
        }
    });

    return new pinchHitterController();
});
