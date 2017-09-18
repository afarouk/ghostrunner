/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var GameModel = Backbone.Model.extend({
        initialize: function() {
            appCache.set('game', this);
            this.on('change', this.getBaseballFieldModel.bind(this));
        },
        kill: function() {
            appCache.remove('game');
            this.destroy();
        },
        baseballFieldSingleton: null,
        getBaseballFieldModel: function() {
            var baseballField = this.get('baseballField'),
                thisUserRole = this.get('thisUser').role,
                thisUserFieldSide = this.get('thisUser').fieldSide.enumText,
                otherUserFieldSide = this.get('otherUser').fieldSide.enumText,
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
                if (position !== 'UNDEFINED') {
                    field[position] = player;
                    if (thisUserRole === 'DEFENSE') {
                        field[position].fieldSide = thisUserFieldSide;
                    } else {
                        field[position].fieldSide = otherUserFieldSide;
                    }
                }
            });
            _.each(baseballField.offensePlayers, function(player){
                var position = player.position.enumText;
                if (position !== 'UNDEFINED') {
                    field[position] = player;
                    if (thisUserRole === 'OFFENSE') {
                        field[position].fieldSide = thisUserFieldSide;
                    } else {
                        field[position].fieldSide = otherUserFieldSide;
                    }
                }
            });
            console.log(field);
            if (this.baseballFieldSingleton) {
                return this.baseballFieldSingleton.set(field);
            } else {
                return this.baseballFieldSingleton = new Backbone.Model(field);
            }
        }
    });
    return GameModel;
});