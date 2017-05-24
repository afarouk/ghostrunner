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
        teamEdit: function(layout, team) {
            $.when(service.retrieveTeamPlayers(team), service.getBaseballFieldPositions())
                .done(function(players, positions){
                    this.onEditTeam(players[0], positions[0], team);
                }.bind(this));
            this.layout = layout;
        },
        lineUpCreate: function(layout, team) {
            $.when(service.retrieveTeamPlayers(team), service.getBaseballFieldPositions())
                .done(function(players, positions){
                    this.onCreateLineUp(players[0], positions[0], team);
                }.bind(this));
            this.layout = layout;
        },
        lineUpEdit: function(layout, team, lineUp) {
            $.when(service.retrieveLineUpPlayers(team, lineUp), service.getBaseballFieldPositions())
                .done(function(players, positions){
                    this.onEditLineUp(players[0], positions[0], team, lineUp);
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
        },
        onEditTeam: function(players, positions, editedTeam) {
            var team = new Backbone.Collection(players),
                createData = {
                    players: new Backbone.Collection(players.players),
                    positions: positions,
                    team: team,
                    editedTeam: editedTeam
                },
                teamEdition = new TeamCreationView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', teamEdition);
            this.listenTo(teamEdition, 'team:save', this.onTeamSave.bind(this, team));
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
            service.createTeam(teamData)
                .then(function(){
                    this.layout.trigger('cancel');//temporary
                }.bind(this));
        },

        //lineUp creation
        onCreateLineUp: function(players, positions, team) {
            var lineUp = new Backbone.Collection(),
                createData = {
                    players: new Backbone.Collection(players.players),
                    positions: positions,
                    lineUp: lineUp,
                    teamName: team.get('displayText')
                },
                lineUpCreation = new LineUpCreationView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpCreation);
            this.listenTo(lineUpCreation, 'lineUp:save', this.onLineUpSave.bind(this, team, lineUp));
        },
        onEditLineUp: function(players, positions, team, editedLineUp) {
            var lineUp = new Backbone.Collection(players),
                createData = {
                    players: new Backbone.Collection(players.players),
                    positions: positions,
                    lineUp: lineUp,
                    teamName: team.get('displayText'),
                    editedLineUp: editedLineUp
                },
                lineUpEdition = new LineUpCreationView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpEdition);
            this.listenTo(lineUpEdition, 'lineUp:save', this.onLineUpSave.bind(this, team, lineUp));
        },
        onLineUpSave: function(team, lineUp, lineUpName) {
            var players = lineUp.map(function(model) {
                    return {
                        playerId: model.get('playerId'),
                        seasonId: model.get('seasonId'),
                        position: model.get('position').enumText
                    };
                }),
                lineUpData = {
                    teamId: team.get('teamId'),
                    displayText: lineUpName,
                    description: '',
                    players: players,
                    type: 'PRIVATE',
                };
            service.createLineup(lineUpData, team.get('teamUUID'))
                .then(function(){
                    this.layout.trigger('cancel');//temporary
                }.bind(this));
        },
    });

    return new CreateTeamController();
});
