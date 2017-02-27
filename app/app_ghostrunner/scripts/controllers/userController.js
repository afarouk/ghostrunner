/*global define */

'use strict';

define([
    '../APIGateway/gateway',
    '../appCache',
    '../Vent',
    '../models/user'
    ], function(gateway, appCache, Vent, User){
    var _killUser = function(response) {
            appCache.get('user').kill();
            localStorage.removeItem('cmxUID');
            Vent.trigger('logout_success', 'loggedOut');
            return response;
        },
        UserController = Mn.Object.extend({
            getCurrentUser: function () {
                return appCache.fetch('user', new User());
            },

            hasCurrentUser: function() {
                if ( appCache.get('user') && appCache.get('user').getUID ) {
                    return appCache.get('user').getUID() ? true : false;
                }
                return false;
            },

            loginUser: function (username, password) {
                return gateway.sendRequest('login', {
                    payload: {
                        userid: username,
                        password: password
                    }
                });
            },

            logout: function(UID){
                return gateway.sendRequest('logout',{
                    UID: UID
                }).then(_killUser);
            }
        });

    return new UserController();
});
