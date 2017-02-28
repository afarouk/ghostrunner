(function($){
	'use strict';

	var loginManager = {
		logged: false,
		//API 
		apiRoot: 'https://simfel.com/apptsvc/rest',
		loginRequest: ['POST', '/authentication/login'],
        logoutRequest: ['GET', '/authentication/logout'],
        loginWithFacebook: ['POST', '/authentication/exchangeFacebookIdForUID'],
        usernameAvailable:['GET', '/authentication/isUserNameAvailable'],
        userForgotPassword: ['PUT', '/authentication/sendEmailForResetPassword'],
        registerNewMember: ['POST', '/authentication/registerNewMemberViaPostBody'],
        getAuthenticationStatus: ['GET', '/authentication/getAuthenticationStatus'],
		//.....
		init: function() {
			this.listenLogin();

			if (localStorage.cmxUID) {
		        this.getSessionFromLocalStorage();
		    }
		},

		getSessionFromLocalStorage: function () {
            var UID = localStorage.getItem('cmxUID');
            
            this.sendRequest(this.getAuthenticationStatus, {UID: UID})
	            .then(function (response) {
	                if (response.action && response.action.enumText === 'NO_ACTION') {
	                    this.onLoginSuccess({
	                        uid: UID,
	                        userName: response.userName
	                    });
	                } else {
	                    localStorage.removeItem('cmxUID');
	                }
	            }.bind(this), function onRequestError () {
	                localStorage.removeItem('cmxUID');
	            });
        },

		sendRequest: function(request, options) {
            var payload = options.payload || '',
            	url = this.apiRoot + request[1], 
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
			localStorage.setItem('cmxUID', response.uid);
			this.logged = true;
			$(window).trigger('ghostrunner.signin', response);
			this.updateLoginButton();
		},

		onLogoutSuccess: function(UID) {
			this.logged = false;
			localStorage.removeItem('cmxUID');
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
        	var UID = localStorage.getItem('cmxUID');
            return this.sendRequest(this.logoutRequest,{
                UID: UID
            }).then(function(response) {
                this.onLogoutSuccess(UID);
            }.bind(this));
        }
	};

	loginManager.init();
})(window.jQuery)