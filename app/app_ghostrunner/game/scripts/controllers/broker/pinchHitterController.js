/*global define */

'use strict';

define([
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/partials/teamCreation',
    '../../views/partials/pinchLineUpCreation',
    '../../views/partials/selectCandidate',
    '../../models/playersCollection'
    ], function(appCache, service, TeamCreationView, PinchLineUpCreation, SelectCandidateView, PlayersCollection){
    var pinchHitterController = Mn.Object.extend({

        retrivePinchHit:function(layout, accept){
            var game = appCache.get('game'),
                lineUp = new Backbone.Model(appCache.get('thisLineUp'));
            service.retrievePinchHitterChoices(lineUp)
                .then(function(players){
                    this.onShapeLineUp(players, lineUp, accept);
                }.bind(this), function(xhr){
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },

        onShapeLineUp: function(players, starterLineUp, accept) {
            this.players = players;
            var lineUp = new Backbone.Collection(),
                createData = {
                    players: (new PlayersCollection()).getLineUps(players.currentLineup),
                    availableplayers: (new PlayersCollection()).getAvailablePlayers(players.availablePlayers),
                    lineUp: lineUp,
                    headings: players.lineUpHeadings
                },
            lineUpCreation = new PinchLineUpCreation(createData);
            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpCreation);
            this.listenTo(lineUpCreation, 'lineUp:save', this.onLineUpSave.bind(this,lineUp, accept));
        },

        onLineUpSave: function(lineUp, accept, playersParams){
            var game = appCache.get('game'),
                params = {
                oldPlayerId : playersParams.oldplayerId,
                oldSeasonId : playersParams.oldseasonId,
                oldLeagueId : playersParams.oldLeagueId,
                oldPlayerRoleId : playersParams.oldPlayerRoleId,
                newPlayerId : playersParams.newplayerId,
                newSeasonId : playersParams.newseasonId,
                newLeagueId : playersParams.newLeagueId,
                newPlayerRoleId : playersParams.newPlayerRoleId,
                newPosition : "UNDEFINED",
                teamId      : this.players.teamId,
                lineupId    : this.players.lineupId,
                gameUUID    : game.get('gameUUID')
            };

            service.setPinchHitter(params).then(function(result){
                this.publicController.getModalsController().afterSaveRequest().then(function(){
                    this.backInGame( params.gameUUID , result.state);
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
