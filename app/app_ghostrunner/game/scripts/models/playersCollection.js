/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var PlayersCollection = Backbone.Collection.extend({
        getAvailablePlayers: function(players) {
            //temporary, should be sorted on bach-end
            var data = _.sortBy(players, function(player){
                return player.role.enumText === 'PITCHER';
            });
            this.set(data);
            return this;
        },
        getStarters: function (players) {
            var data = _.where(players, {availableForStarter: true});
            this.set(data);
            return this;
        },
        getLineUps: function(players) {
            var data = _.where(players, {availableForLineup: true});
            this.set(data);
            return this;
        }
    });
    return PlayersCollection;
});