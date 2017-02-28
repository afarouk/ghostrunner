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

/*
- Home(id)
- Away(id)
- id(id)
- current inning
- player positions
- [game state]
*/
