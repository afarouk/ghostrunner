/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var PlayersCollection = Backbone.Collection.extend({
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