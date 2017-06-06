/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var GameModel = Backbone.Model.extend({
        initialize: function() {
            appCache.set('game', this);
        },
        kill: function() {
            appCache.remove('game');
            this.destroy();
        }
    });
    return GameModel;
});