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
        },
        getBaseballFieldModel: function() {
            var baseballField = this.get('baseballField'),
                field = {
                    FIELD_P: null,
                    FIELD_C: null,
                    FIELD_1B: null,
                    FIELD_2B: null,
                    FIELD_3B: null,
                    FIELD_SS: null,
                    FIELD_LF: null,
                    FIELD_CF: null,
                    FIELD_RF: null,
                    BATTER_LH: null,
                    BATTER_RH: null,
                    BATTER_1R: null,
                    BATTER_2R: null,
                    BATTER_3R: null,
                    BATTER_SS: null //I am not sure that it's needed
                };
            _.each(baseballField.defensePlayers, function(player){
                var position = player.position.enumText;
                field[position] = player;
            });
            _.each(baseballField.offensePlayers, function(player){
                var position = player.position.enumText;
                field[position] = player;
            });
            console.log(field);
            return new Backbone.Model(field);
        }
    });
    return GameModel;
});