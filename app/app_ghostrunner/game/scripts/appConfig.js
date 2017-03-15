/*global define, window */

'use strict';

var apiRoot = 'https://simfel.com/apptsvc/rest'

module.exports = {
    getAPIRoot: function() {
    	return apiRoot
    },
    setAPIRoot: function(server) {
    	apiRoot = 'https://' + server + '/apptsvc/rest';
    }
};
