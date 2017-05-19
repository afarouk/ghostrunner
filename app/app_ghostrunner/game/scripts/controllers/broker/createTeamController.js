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
        teamCreate: function(layout) {
            //TODO prepare team creation
            //get players list for team
            //and select players from list
            //maybe drag and drop in future
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
            var createData = {
                    players: players.players,
                    positions: positions
                },
                teamCreation = new TeamCreationView(createData);

            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', teamCreation);
        },
        onCreateLineUp: function(players, positions) {
            var createData = {
                    players: players.players,
                    positions: positions
                },
                lineUpCreation = new LineUpCreationView(createData);


            this.layout.$el.addClass('creation-state');
            this.layout.showChildView('creation', lineUpCreation);
        },
    });

    return new CreateTeamController();
});
