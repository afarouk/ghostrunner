/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            login: ['POST', '/authentication/login'],
            logout: ['GET', '/authentication/logout'],

            getAuthenticationStatus: ['GET', '/authentication/getAuthenticationStatus']
        };
    }
};
