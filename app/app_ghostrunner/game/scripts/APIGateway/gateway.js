/*global define */

'use strict';

define([
    '../APIGateway/addressMap.js',
    '../appConfig'
    ], function(addressMap, config){
    var _resolveMethod = function(name){
            return addressMap.getAddressMap()[name][0];
        },
        _resolveAddress = function(name){
            return config.getAPIRoot() + addressMap.getAddressMap()[name][1];
        },
        Gateway = Mn.Object.extend({
            sendRequest: function(name, options) {
                options = options || {};
                var url, method, formData, UID;

                try {
                    url = _resolveAddress(name);
                    method = _resolveMethod(name);
                } catch(e) {
                    console.error('request "' + name + '" could not be mapped to any api call');
                    return $.Deferred().reject('request "' + name + '" could not be mapped to any api call').promise();
                }

                // This is for all the rest
                var payload = options.payload;
                delete options.payload;

                return $.ajax({
                    type: method,
                    url: (options ? url + '?' + $.param(options) : url),
                    data: JSON.stringify(payload),
                    contentType: 'application/json',
                    processData: false,
                    timeout: 10000
                });

            }
        });
    return new Gateway();
});

