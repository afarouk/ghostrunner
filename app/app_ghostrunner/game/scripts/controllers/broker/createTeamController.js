/*global define */

'use strict';

define([
    '../../Vent',
    '../../appCache',
    '../../APIGateway/gameService'
    ], function(Vent, appCache, service){
    var CreateTeamController = Mn.Object.extend({
        create: function() {
            //TODO prepare team creation
            //get players list for team
            //and select players from list
            //maybe drag and drop in future
        }
    });

    return new CreateTeamController();
});
