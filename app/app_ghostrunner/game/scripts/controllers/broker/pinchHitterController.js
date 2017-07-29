/*global define */

'use strict';

define([
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/partials/teamCreation',
    '../../views/partials/PintchlineUpCreation',
    '../../views/partials/selectCandidate',
    '../../models/playersCollection'
    ], function(appCache, service, TeamCreationView, PintchlineUpCreation, SelectCandidateView, PlayersCollection){
    var pinchHitterController = Mn.Object.extend({

        retrivePinchHit:function(layout, accept){

            var game = appCache.get('game'),
                lineUp = new Backbone.Model(appCache.get('thisLineUp'));
            service.retrievePinchHitterChoices(lineUp)
                .then(function(players){
                 this.onShapeLineUp(players, lineUp, accept);
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
            lineUpCreation = new PintchlineUpCreation(createData);
            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpCreation);
            this.listenTo(lineUpCreation, 'lineUp:save', this.onLineUpSave.bind(this,lineUp,accept));
        },

        onLineUpSave: function(slf,lineUp,obj){
            var game = appCache.get('game');
            var obj = {
                oldPlayerId : obj.oldplayerId,
                oldSeasonId : obj.oldseasonId ,
                oldLeagueId : obj.oldLeagueId ,
                newPlayerId : obj.newplayerId,
                newSeasonId : obj.newseasonId ,
                newLeagueId : obj.newLeagueId ,
                newPosition : "UNDEFINED",
                teamId      : this.players.teamId,
                lineupId    : this.players.lineupId,
                gameUUID    : game.get('gameUUID')
            };
           service.setPinchHitter(obj).then(function(result){
               this.publicController.getModalsController().afterSaveRequest().then(function(){
               this.backInGame( obj.gameUUID , result.state);
               }.bind(this))
            }.bind(this));

        },
        backInGame: function( gameUUID , state) {
            this.publicController.getStateController().refreshStatus(gameUUID);
            this.publicController.getGameController().switchToGame();
        }
    });

    return new pinchHitterController();
});
