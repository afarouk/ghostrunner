/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/partials/teamCreation',
    '../../views/partials/lineUpCreation'
    ], function(Vent, appCache, service, TeamCreationView, LineUpCreationView){
    var CreateTeamController = Mn.Object.extend({
        //team creation
        teamCreate: function(layout) {
            $.when(service.retrieveAvailablePlayers(), service.getBaseballFieldPositions())
                .done(function(players, positions){
                    this.onCreateTeam(players[0], positions[0]);
                }.bind(this));
            this.layout = layout;
        },
        lineUpCreate: function(layout, teamId) {
            $.when(service.retrieveTeamPlayers(teamId), service.getBaseballFieldPositions())
                .done(function(players, positions){
                    this.onCreateLineUp(players[0], positions[0]);
                }.bind(this));
            this.layout = layout;
        },
        onCreateTeam: function(players, positions) {
            var team = new Backbone.Collection(),
                createData = {
                    players: new Backbone.Collection(players.players),
                    positions: positions,
                    team: team
                },
                teamCreation = new TeamCreationView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', teamCreation);
            this.listenTo(teamCreation, 'team:save', this.onTeamSave.bind(this, team));
            // team.on('change add remove', this.onTeamChanged.bind(this));
        },
        onTeamSave: function(team, teamName) {
            var players = team.map(function(model) {
                    return {
                        playerId: model.get('playerId'),
                        seasonId: model.get('seasonId')
                    };
                }),
                teamData = {
                    displayText: teamName,
                    description: '',
                    players: players
                };
            service.createTeam(teamData);
        },
        // onTeamChanged: function(model, collection, action) {
            
        // },

        //lineUp creation
        onCreateLineUp: function(players, positions) {
            var lineUp = new Backbone.Collection(),
                createData = {
                    players: new Backbone.Collection(players.players),
                    positions: positions,
                    lineUp: lineUp
                },
                lineUpCreation = new LineUpCreationView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpCreation);
            this.listenTo(lineUpCreation, 'lineUp:save', this.onLineUpSave.bind(this, lineUp));
        },
        onLineUpSave: function(lineUp, lineUpName) {
            var players = lineUp.map(function(model) {
                    return {
                        playerId: model.get('playerId'),
                        seasonId: model.get('seasonId'),
                        position: model.get('position').enumText
                    };
                }),
                lineUpData = {
                    displayText: lineUpName,
                    description: '',
                    players: players
                };
            service.createLineup(lineUpData);
        },
    });

    return new CreateTeamController();
});
