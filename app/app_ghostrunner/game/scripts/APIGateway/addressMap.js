/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
        	getGame: ['GET', '/gaming/getGame'],
        	makeMove: ['POST', '/gaming/makeMove']
        };
    }
};
