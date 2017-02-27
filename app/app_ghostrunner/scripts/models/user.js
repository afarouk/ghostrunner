/*global define*/

'use strict';

define([
    '../globalHelpers.js'
    ], function(h){
    var UserModel = Backbone.Model.extend({
        initialize: function(UID, userName){
            this.UID = UID || '';
            this.userName = userName ||'';
        },
        kill: function(){
            this.setUID('');
        },

        getUserName: function() {
            return this.userName;
        },

        setUserName: function(name) {
            this.userName = name;
        },

        getUID: function(){
            return this.UID;
        },

        setUID: function(UID){
            this.UID = UID;
        }
    });
    return UserModel;
});
