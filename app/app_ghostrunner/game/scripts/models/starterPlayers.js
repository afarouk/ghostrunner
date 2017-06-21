/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var StarterPlayersCollection = Backbone.Collection.extend({
        create: function (players) {
            var data = _.where(players, {availableForStarter: true});
            this.set(data);
            return this;
        }
    });
    return StarterPlayersCollection;
});