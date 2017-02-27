/*global define*/

'use strict';

define([
    '../controllers/userController.js',
    '../Vent',
    '../appCache.js',
    '../APIGateway/gateway',
    '../models/user.js'
    ], function(userController, Vent, appCache, gateway, User){
    var _onLoginSuccess = function (response, loginMethod) {

            var user = appCache.fetch('user', new User());
            user.initiate(response.uid, response.userName);

            if (response.localStorage !== false) {
                localStorage.setItem('cmxUID', response.uid);
            };
            Vent.trigger('login_success', loginMethod);

            return {
                uid: response.uid,
                username: response.userName
            };
        },
        SessionActions = Mn.Object.extend({
            getCurrentUser: function () {
                return appCache.fetch('user', new User());
            },

            setUser: function (uid, username) {
                return appCache.set('user', new User(uid, username));
            },

            authenticate: function (uid) {
                return gateway.sendRequest('getAuthenticationStatus', {UID: uid}).then(function (response) {
                    if (response.action && response.action.enumText === 'NO_ACTION') {
                        _onLoginSuccess({
                            uid: uid,
                            userName: response.userName
                        }, 'fromSignInForm');
                    }
                });
            },

            getSessionFromLocalStorage: function () {
                var dfd = $.Deferred();
                var persistedUID;

                persistedUID = localStorage.getItem('cmxUID');
                if (persistedUID) {
                    window.asdesds=persistedUID;
                    gateway.sendRequest('getAuthenticationStatus', {UID: persistedUID}).then(function (response) {
                        if (response.action && response.action.enumText === 'NO_ACTION') {
                            _onLoginSuccess({
                                uid: persistedUID,
                                userName: response.userName
                            }, 'fromLocalstorage');
                        } else {
                            localStorage.removeItem('cmxUID');
                        }
                        dfd.resolve();
                    }, function onRequestError () {
                        localStorage.removeItem('cmxUID');
                        dfd.resolve();
                    });
                } else {
                    dfd.resolve();
                }
                return dfd.promise();
            },

            startSession: function ( username, password ) {
                return userController.loginUser(username, password)
                    .then(_onLoginSuccess);
            }
        }); 

    return new SessionActions();
});


