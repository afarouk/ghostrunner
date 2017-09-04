/*global define*/

'use strict';

var helpers = function() {
    return {
        //API
        // apiRoot: 'https://simfel.com/apptsvc/rest',
        apiRoot: 'http://54.191.91.125/apptsvc/rest',

        dataURLtoBlob: function(data) {
            if (!data || data ===undefined) {
                return "";
            }
            var mimeString = data.split(',')[0].split(':')[1].split(';')[0];
            var byteString = atob(data.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder);
            if (bb) {
                bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
                bb.append(ab);
                return bb.getBlob(mimeString);
            } else {
                bb = new Blob([ab], {
                    'type': (mimeString)
                });
                return bb;
            }
        },

        parseQueryString: function(qs) {
            if (!qs) return;
            var result = {};
            var params = qs.replace('?', '').split('&');

            _(params).each(function (param) {
                var pair = param.split('=');
                if (pair[1] === 'true' ) {
                    pair[1] = true;
                }
                else if (pair[1] === 'false') {
                    pair[1] = false;
                }
                result[pair[0]] = pair[1];
            });

            return result;
        },

        validateEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        sendRequest: function(request, options) {
            var payload = options.payload ? JSON.stringify(options.payload) : '',
                url = this.getAPIRoot() + request[1],
                method = request[0];

            delete options.payload;

            return $.ajax({
                type: method,
                url: (options ? url + '?' + $.param(options) : url),
                data: payload,
                contentType: 'application/json',
                processData: false,
                timeout: 10000
            }).fail(function (jqXHR, textStatus, errorThrown) {
              /*
               AF: I have added this 'fail' method to handle communication failure
               or internet failure where the client is unable to reach the
               server. Note that in such a case, where the server is down,
               textStatus="error" and errorThrown="".
               You can use this artifact to pop up a message saying
               "Unable to reach game server", "OK" or reimplement it in your
               own way. The objective is to inform the user when the internet
               is down or disconnected. During game we don't worry about this
               because the socket takes care of it. But before the socket is
               opened, during login, this handler is needed. 
               */
                if (jqXHR.status !== 400) {
                    console.log("helpers.js::sendRequest() textStatus:"+textStatus+", errorThrown:"+errorThrown);
                    var message = jqXHR.status === 0 ? 'Connection lost.' : 'Internal Server Error.';
                    $('.modal[role="dialog"]').modal('hide');
                    $('#error-msg .message-text').text(message);
                    $('#error-msg').modal()
                        .off('shown.bs.modal')
                        .on('shown.bs.modal', function() {
                            //focuses on modals ok button
                            $(this).find('input').focus();
                    });
                }
            });
        },

        getAPIRoot: function() {
            var search = window.location.search,
                params = this.parseQueryString(search),
                server;
            if (params && params.server) {
                server = params.server;
            }
            if (server=='localhost:8080') {
                return server ? 'http://' + server + '/apptsvc/rest' : this.apiRoot;
            } else {
                return server ? 'https://' + server + '/apptsvc/rest' : this.apiRoot;
            }
        }

    };
};

module.exports = helpers;
