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
                }.bind(this), function(xhr){
                    this.publicController.getBrokerController().hideLoader();
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },
        teamEdit: function(layout, team) {
            service.retrieveTeamPlayers(team)
                .then(function(players){
                    this.onEditTeam(players, team);
                }.bind(this), function(xhr){
                    this.publicController.getBrokerController().hideLoader();
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },
        selectCandidate: function(layout, team) {
            service.retrieveTeamPlayers(team, 'STARTER')
                .then(function(players){
                    this.onSelectCandidate(players, team);
                }.bind(this), function(xhr){
                    this.publicController.getBrokerController().hideLoader();
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },
        lineUpShape: function(layout, accept) {
            var game = appCache.get('game'),
                lineUp = new Backbone.Model(game.get('thisLineUp'));
                
            //!!!TODO manage case with LINEUP_INVITED state

            service.retrieveAvailableTeamPlayers(lineUp)
                .then(function(players){
                    this.onShapeLineUp(players, lineUp, accept);
                }.bind(this), function(xhr){
                    this.publicController.getBrokerController().hideLoader();
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
            this.layout = layout;
        },
        onCreateTeam: function(players) {
            var team = new Backbone.Collection(),
                createData = {
                    players: (new PlayersCollection()).getAvailablePlayers(players.players),
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
                        seasonId: model.get('seasonId'),
                        leagueId: model.get('leagueId'),
                        playerRoleId : model.get('playerRoleId')
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
                }.bind(this), function(xhr){
                    this.publicController.getBrokerController().hideLoader();
                    this.publicController.getModalsController().apiErrorPopup(xhr);
                }.bind(this));
        },

        onReturnToTeamSelection: function() {
            this.publicController.getBrokerController().onReturnToTeamSelection();
        },

        //select candidate
        onSelectCandidate: function(players, team) {
            var createData = {
                    players: (new PlayersCollection()).getStarters(players.players),
                    headings: players.starterHeadings,
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
        onShapeLineUp: function(players, starterLineUp, accept) {
            var lineUp = new Backbone.Collection(),
                createData = {
                    players: (new PlayersCollection()).getLineUps(players.players),
                    lineUp: lineUp,
                    teamName: 'test name',
                    lineUpName: starterLineUp.get('displayText'),
                    headings: players.lineUpHeadings,
                },
                lineUpCreation = new LineUpCreationView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpCreation);
            this.listenTo(lineUpCreation, 'lineUp:save', this.onLineUpSave.bind(this, lineUp, accept));
        },
        onLineUpSave: function(lineUp, accept) {
            // lineUp.remove(lineUp.at(0), {silent: true}); //remove starter
            var game = appCache.get('game'),
                players = lineUp.map(function(model) {
                    return {
                        playerId: model.get('playerId'),
                        seasonId: model.get('seasonId'),
                        leagueId: model.get('leagueId'),
                        playerRoleId: model.get('playerRoleId'),
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
            if (accept) {
                this.publicController.getModalsController().onSelectRole()
                    .then(function(role){
                       this.publicController.getStateController().onInvitationAccepted(lineUpData, role);
                    }.bind(this));
            } else {
                service.selectRemainingLineUp(lineUpData)
                    .then(function(){
                        this.publicController.getStateController().killGame();
                        this.publicController.getModalsController().afterLineUpSelected()
                            .then(function(){
                                this.layout.trigger('cancel');//temporary
                            }.bind(this));
                    }.bind(this), function(xhr){
                        this.publicController.getBrokerController().hideLoader();
                        this.publicController.getModalsController().apiErrorPopup(xhr);
                    }.bind(this));
            }
        }
    });
    return new CreateTeamController();
});
