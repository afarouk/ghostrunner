/*global define */

'use strict';

define([
    '../../appCache',
    '../../APIGateway/gameService',
    '../../views/partials/teamCreation',
    '../../views/partials/lineUpCreation',
    '../../views/partials/selectCandidate',
    '../../models/playersCollection'
    ], function(appCache, service, TeamCreationView, LineUpCreationView, SelectCandidateView, PlayersCollection){
    var CreateTeamController = Mn.Object.extend({
        //team creation
        teamCreate: function(layout) {
            this.publicController.getBrokerController().showLoader();
            service.retrieveAvailablePlayers()
                .then(function(players){
                    this.onCreateTeam(players);
                }.bind(this));
            this.layout = layout;
        },
        teamEdit: function(layout, team) {
            service.retrieveTeamPlayers(team)
                .then(function(players){
                    this.onEditTeam(players, team);
                }.bind(this));
            this.layout = layout;
        },
        selectCandidate: function(layout, team) {
            service.retrieveTeamPlayers(team, 'PITCHER')
                .then(function(players){
                    this.onSelectCandidate(players, team);
                }.bind(this));
            this.layout = layout;
        },
        lineUpShape: function(layout, accept) {
            var game = appCache.get('game'),
                lineUp = new Backbone.Model(game.get('thisLineUp'));
            $.when(service.retrieveTeamPlayers(lineUp), service.getBaseballFieldPositions())
                .done(function(players, positions){
                    this.onShapeLineUp(players[0], positions[0], lineUp, accept);
                }.bind(this));
            this.layout = layout;
        },
        onCreateTeam: function(players) {
            var team = new Backbone.Collection(),
                createData = {
                    players: new Backbone.Collection(players.players),
                    team: team
                },
                teamCreation = new TeamCreationView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', teamCreation);
            this.listenTo(teamCreation, 'team:save', this.onTeamSave.bind(this, team));
            this.listenTo(teamCreation, 'cancel', this.onReturnToTeamSelection.bind(this, team));

            this.publicController.getBrokerController().hideLoader();
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
                    this.onReturnToTeamSelection();
                }.bind(this));
        },

        onReturnToTeamSelection: function() {
            this.publicController.getBrokerController().onReturnToTeamSelection();
        },

        //select candidate
        onSelectCandidate: function(players, team) {
            var createData = {
                    players: (new PlayersCollection()).getStarters(players.players),
                    teamName: team.get('displayText')
                },
                candidateSelection = new SelectCandidateView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', candidateSelection);
            this.listenTo(candidateSelection, 'lineUp:save', this.onCandidateSelected.bind(this));
            this.listenTo(candidateSelection, 'cancel', this.onReturnToTeamSelection.bind(this));
        },
        onCandidateSelected: function(lineUpName, player) {
            this.publicController.getBrokerController().onCandidateSelected(lineUpName, player);
        },
        onShapeLineUp: function(players, positions, starterLineUp, accept) {
            var lineUp = new Backbone.Collection(starterLineUp.get('players')),
                createData = {
                    players: (new PlayersCollection()).getLineUps(players.players),
                    positions: positions,
                    lineUp: lineUp,
                    teamName: 'test name',
                    lineUpName: starterLineUp.get('displayText')
                },
                lineUpCreation = new LineUpCreationView(createData);

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
                        position: model.get('position').enumText
                    };
                }),
                lineUpData = {
                    gameUUID: game.get('gameUUID'),
                    players: players
                };
            if (accept) {
                this.publicController.getModalsController().onSelectRole()
                    .then(function(role){
                       this.publicController.getStateController().onInvitationAccepted(lineUpData, role); 
                    }.bind(this));
            } else {
                service.selectLineUp(lineUpData)
                    .then(function(){
                        this.layout.trigger('cancel');//temporary
                    }.bind(this));
            }
        }
    });

    return new CreateTeamController();
});
