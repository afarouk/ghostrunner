/*global define, window */

'use strict';

// var baseRoot = 'simfel.com';
var baseRoot = '54.191.91.125',
	apiSufix = '/apptsvc/rest',
	wsSufix = '/apptsvc/ws/gaming/gamingsecret';

module.exports = {
	setBaseRoot: function(server) {
    	baseRoot = server;
    },

    getAPIRoot: function() {
    	if(baseRoot === 'localhost:8080' || baseRoot === '54.191.91.125') {
	        return 'http://' + baseRoot + apiSufix;
		} else {
			return 'https://' + baseRoot + apiSufix;
		}
    },

    getWebSocketRoot: function() {
        if ( baseRoot === 'localhost:8080' || baseRoot === '54.191.91.125') {
			return 'ws://' + baseRoot + wsSufix;
		} else {
			return 'wss://' + baseRoot + wsSufix;
		}
    },
};
