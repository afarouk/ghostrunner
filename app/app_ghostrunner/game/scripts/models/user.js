/*global define*/

'use strict';

define([
    '../appCache'
    ], function(appCache){
    var UserModel = Backbone.Model.extend({
        initialize: function() {
            appCache.set('user', this);
        },
        kill: function() {
            appCache.remove('user');
            this.destroy();
        }
    });
    return UserModel;
});
