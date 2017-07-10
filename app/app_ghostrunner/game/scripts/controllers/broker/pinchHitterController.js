/*global define */

'use strict';

define([
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/partials/teamCreation',
    '../../views/partials/PintchlineUpCreation',
    '../../views/partials/selectCandidate',
    '../../models/PlayersCollection'
    ], function(appCache, service, TeamCreationView, PintchlineUpCreation, SelectCandidateView, PlayersCollection){
    var CreateTeamController = Mn.Object.extend({
        
        retrivePinchHit:function(layout, accept){
            var game = appCache.get('game'),
                lineUp = new Backbone.Model(appCache.get('thisLineUp'));
            service.retrievePinchHitterChoices(lineUp)
                .then(function(players){
                console.log(players);
                 this.onShapeLineUp(players, lineUp, accept);
                }.bind(this));
            this.layout = layout;
        },
        
        lineUpShape: function(layout, accept) {
            var game = appCache.get('game'),
                lineUp = new Backbone.Model(game.get('thisLineUp'));
            service.retrieveTeamPlayers(lineUp)
                .then(function(players){
                    this.onShapeLineUp(players, lineUp, accept);
                }.bind(this));
            this.layout = layout;
        },
        
        onShapeLineUp: function(players, starterLineUp, accept) {
            var lineUp = new Backbone.Collection(),
                createData = {
                    players: (new PlayersCollection()).getLineUps(players.currentLineup),
                    availableplayers: (new PlayersCollection()).getAvailablePlayers(players.availablePlayers),
                    lineUp: lineUp,
                    headings: players.lineUpHeadings,
                },
            lineUpCreation = new PintchlineUpCreation(createData);
            
            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpCreation);
            this.listenTo(lineUpCreation, 'lineUp:save', this.onLineUpSave.bind(this, lineUp, accept));
        },
        onLineUpSave: function(lineUp, accept) {
            lineUp.remove(lineUp.at(0), {silent: true}); //remove starter
            var game = appCache.get('game'),
                players = lineUp.map(function(model) {
                    return {
                        playerId: model.get('playerId'),
                        seasonId: model.get('seasonId'),
                        position: model.get('position').enumText,
                        type: model.get('type').enumText,
                        role: model.get('role').enumText,
                        battingOrder: model.get('battingOrder'),
                        pitchingRole: model.get('pitcherRole').enumText
                    };
                }),
                lineUpData = {
                    gameUUID: game.get('gameUUID'),
                    players: players
                };
    
        }
    });

    return new CreateTeamController();
});
