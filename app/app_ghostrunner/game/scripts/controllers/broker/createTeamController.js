/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../APIGateway/gameService'
    ], function(Vent, appCache, service){
    var CreateTeamController = Mn.Object.extend({
        teamCreate: function() {
            //TODO prepare team creation
            //get players list for team
            //and select players from list
            //maybe drag and drop in future
            service.retreiveAvailablePlayers()
                then(function(){

                }.bind(this));
        },
        lineUpCreate: function(teamId) {
            service.retrieveTeamPlayers(teamId)
                then(function(){

                }.bind(this));
        }
    });

    return new CreateTeamController();
});
