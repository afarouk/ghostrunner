/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../appCache',
    '../Vent'
    ], function(gateway, appCache, Vent){
    var GameController = Mn.Object.extend({
            start: function(){
                console.log('game start');
            }
        });

    return new GameController();
});
