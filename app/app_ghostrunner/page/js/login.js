(function($){
	'use strict';

	var loginManager = {
		logged: false,
		//API
		apiRoot: 'https://simfel.com/apptsvc/rest',
		loginRequest: ['POST', '/gaming/login'],
        logoutRequest: ['GET', '/gaming/logout'],
        loginWithFacebook: ['POST', '/authentication/exchangeFacebookIdForUID'],
        usernameAvailable:['GET', '/authentication/isUserNameAvailable'],
        userForgotPassword: ['PUT', '/authentication/sendEmailForResetPassword'],
        registerNewMember: ['POST', '/authentication/registerNewMemberViaPostBody'],
        getAuthenticationStatus: ['GET', '/gaming/getAuthenticationStatus'],
		//.....
		init: function() {
			this.listenLogin();
			if (Cookie.get('cmxUID')) {
		        this.getSessionFromCookie();
		    }
		},

		getSessionFromCookie: function () {
            var UID = Cookie.get('cmxUID');

            this.sendRequest(this.getAuthenticationStatus, {UID: UID})
	            .then(function (response) {
	                if (response.action && response.action.enumText === 'NO_ACTION') {
	                    this.onLoginSuccess({
	                        uid: UID,
	                        userName: response.userName
	                    });
	                } else {
	                    Cookie.remove('cmxUID');
	                }
	            }.bind(this), function onRequestError () {
	                Cookie.remove('cmxUID');
	            });
        },

		sendRequest: function(request, options) {
            var payload = options.payload || '',
            	url = this.getAPIRoot() + request[1],
            	method = request[0];
            delete options.payload;

            return $.ajax({
                type: method,
                url: (options ? url + '?' + $.param(options) : url),
                data: JSON.stringify(payload),
                contentType: 'application/json',
                processData: false,
                timeout: 10000
            });
        },

		listenLogin: function() {
			$('.login-btn').on('click', function(){
				if (this.logged) {
					this.logoutUser();
				} else {
	    			$('#signin').modal();
	    		}
	    	}.bind(this));
	    	$('#signin .login').on('click', function(){
	    		var username = $('#signin [name="user"]').val(),
	    			password = $('#signin [name="pass"]').val();
	    		this.onSignin(username, password);
	    	}.bind(this));
		},

		showLoginError: function() {
			//TODO show login error
			console.log('login error');
		},

		onLoginSuccess: function(response) {
			Cookie.set('cmxUID', response.uid);
			this.logged = true;
            $('.show_userName').text(response.userName);
			$(window).trigger('ghostrunner.signin', response);
			this.updateLoginButton();
		},

		onLogoutSuccess: function(UID) {
			this.logged = false;
			Cookie.remove('cmxUID');
            $('.show_userName').text('');
			$(window).trigger('ghostrunner.signout', UID);
			this.updateLoginButton();
		},

		//TODO temporary for testing
		updateLoginButton: function() {
			if (this.logged) {
				$('.login-btn').text('LOGOUT');
			} else {
				$('.login-btn').text('LOGIN');
			}
		},
		//...................

		onSignin: function(username, password) {
            this.loginUser(username, password)
                .then(function(response) {
                    this.onLoginSuccess(response);
                    $('#signin').modal('hide');
                }.bind(this), function(jqXHR) {
	                if( jqXHR.status === 400 ) {
	                    this.showLoginError();
	                }
            }.bind(this));
        },

        loginUser: function (username, password) {
            return this.sendRequest(this.loginRequest, {
                payload: {
                    userid: username,
                    password: password
                }
            });
        },

        logoutUser: function(UID){
        	var UID = Cookie.get('cmxUID');
            return this.sendRequest(this.logoutRequest,{
                UID: UID
            }).then(function(response) {
                this.onLogoutSuccess(UID);
            }.bind(this));
        },

        getAPIRoot: function() {
        	var search = window.location.search,
        		params = this.parseQueryString(search),
        		server;
        	if (params && params.server) {
        		server = params.server;
        	}
		      if(server==='localhost:8080'){
						return server ? 'http://' + server + '/apptsvc/rest' : this.apiRoot;
		      }else{
						return server ? 'https://' + server + '/apptsvc/rest' : this.apiRoot;
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
        }
        
	};

	$(document).ready( function() {
		loginManager.init();
	});
})(window.jQuery)
