/*global define*/
'use strict';

define([
    './helpers'
    ], function(h){
    var loginManager = {
    	logged: false,
    	loginRequest: ['POST', '/gaming/login'],
    	registerRequest: ['POST', '/gaming/registerNewMember'],
        logoutRequest: ['GET', '/gaming/logout'],
        loginWithFacebookRequest: ['POST', '/authentication/exchangeFacebookIdForUID'],
        usernameAvailable:['GET', '/authentication/isUserNameAvailable'],
        userForgotPassword: ['PUT', '/authentication/sendEmailForResetPassword'],
        registerNewMember: ['POST', '/authentication/registerNewMemberViaPostBody'],
        getAuthenticationStatus: ['GET', '/gaming/getAuthenticationStatus'],
        SendContactUsEmail:['POST','/gaming/sendContactUsEmail'],

        init: function() {
            var params = h().parseQueryString(window.location.search),UID;
    		this.listenLogin();
    		this.listenRegister();
            this.listenContact();

            if (params && params.UID){
                this.autoLoginByUID(params.UID);
            } else if (Cookie.get('cmxUID')) {
    	        this.getSessionFromCookie();
    	    }
    	},

    	getSessionFromCookie: function () {
            var UID = Cookie.get('cmxUID');

            h().sendRequest(this.getAuthenticationStatus, {UID: UID})
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

        autoLoginByUID: function (UID) {
            h().sendRequest(this.getAuthenticationStatus, {UID: UID})
                .then(function (response) {
                    if (response.action && response.action.enumText === 'NO_ACTION') {
                        Cookie.remove('cmxUID');
                        this.onLoginSuccess({
                            uid: UID,
                            userName: response.userName
                        });

                    }else{
                       console.log('not login');
                    }
                }.bind(this), function onRequestError () {
                       console.log('error');
                });
        },

    	listenLogin: function() {
            $('#signin input').on('click',function(){
                $('.error_dv').hide();
                $('.success_dv').hide();
            });
    		$('.login-btn').on('click', function(){
    			if (this.logged) {
    				this.logoutUser();
    			} else {
        			$('#signin').modal();
        		}
        	}.bind(this));
            
            FB.getLoginStatus(function (response) {
                        this.facebookStatus = response.status;
                   }.bind(this), true);
            
            $('#signin .login-facebook').on('click', function(){
                this.facebookLoginStatus(this.facebookStatus);
        	}.bind(this));
            
            $('.register_btn').on('click', function(){
    			$('#signin').modal('hide');
    			$('#signup').modal();
        	}.bind(this));
            
        	$('#signin .login').on('click', function(){
        		var username = $('#signin [name="user"]').val(),
        			password = $('#signin [name="pass"]').val();
        		this.onSignin(username, password);
        	}.bind(this));
            
            $(window).on('ghostrunner.afterLogout', this.onAfterLogout.bind(this));
    	},
        
        listenContact: function() {
    		$('input[name="submit"]').click(function(){
                var Response =  grecaptcha.getResponse();
                if(Response.length>0) {   
    			    this.SendMessage();
                }else {       
                    alert("Invalid Captcha");
                    $('#sendMessage')[0].reset();
                } 
        	}.bind(this));
    	},
        
        listenRegister: function() {
            $('#signup input').on('click',function(){
                $('.error_dv').hide();
                $('.success_dv').hide();
            });
        	$('#signup .register').on('click', function(){
        		var username = $('#signup [name="userName"]').val(),
        			password = $('#signup [name="userPassword"]').val(),
                    cpass    = $('#signup [name="userConfirmPassword"]').val();
                if(username.trim()==""){
                    $('.error_dv').text('Please enter your username or email.');
                    $('.error_dv').show();
                    return false;
                }else if(password.trim()!=cpass.trim()){
                    $('.error_dv').text('Confirm password not matched.');
                    $('.error_dv').show();
                    return false;
                }else{
                   this.onRegister(username, password); 
                }
        	}.bind(this));
            
            $('#signup #show_password').on('click', function(e){
                if($("#signup #show_password").is(':checked')){
                  $('#signup [name="userPassword"]').attr('type','text');
                  $('#signup [name="userConfirmPassword"]').attr('type','text');  
                }else{
                  $('#signup [name="userPassword"]').attr('type','password');
                  $('#signup [name="userConfirmPassword"]').attr('type','password');  
                }
        			
        	}.bind(this));
    	},
        
        onUserFacebookLogin: function() {
    		this.facebookLoginStatus(this.facebookStatus)
                .then(function(response){
                    if (response.success) {
                    	$('#signin').modal('hide');
                    } else {
                    	console.log(response.error);
                    }
                }.bind(this));
    	},
        
        facebookLoginStatus: function(status) {
            var def = $.Deferred()
            if (status === 'connected') {
                this.getPublicProfile(def);
            } else {
                FB.login(function(response) {
                    if (response.authResponse) {
                        this.getPublicProfile(def);
                    } else {
                        def.resolve({error:'User cancelled login or did not fully authorize.'});
                    }
                }.bind(this), { scope: 'email' });
            }
            return $.when(def);
        },
        
        getPublicProfile: function(def) {
            FB.api('/me', {fields: 'id,name,first_name,last_name,email'}, 
                function(response){
                if (response.id) {
                    this.loginWithFacebook(response);
                    def.resolve({success: 'Loggedin with facebook'});
                } else {
                    def.resolve({error:'Can\'t login with facebook'});
                }
            }.bind(this));
        },

        loginWithFacebook: function(publicProfile) {
            return this.loginUserWithFacebook(publicProfile)
                .then(function(response){
                    this.onLoginSuccess(response);
                    $('#signin').modal('hide');
                }.bind(this), function(jqXHR) {
                //TODO manage error case
                }.bind(this));
        },
        
        loginUserWithFacebook: function(publicProfile) {
            return h().sendRequest(this.loginWithFacebookRequest, {
                payload: publicProfile
            });
        },
        
        onRegister: function(username, password) {
            this.registerUser(username, password)
                .then(function(response) {
                    this.onRegisterSuccess(response);
                    $('#signup').modal('hide');
                }.bind(this), function(jqXHR) {
                    var err=JSON.parse(jqXHR.responseText);
                    this.showError(err.error.message);
            }.bind(this));
        },
        
        registerUser: function (username, password) {            
            return h().sendRequest(this.registerRequest, {
                payload: {
                    email: username,
                    password: password
                }
            });
        },
        
        onRegisterSuccess: function(response) {
            Cookie.set('cmxUID', response.uid);
    		this.logged = true;
            $('.show_userName').text(response.userName);
    		$(window).trigger('ghostrunner.signin', response);
    		this.updateLoginButton();
    	},
        
    	showError: function(message) {
    		$('.error_dv').text(message);
            $('.error_dv').show();
    	},
        
        showLoginError: function(jqXHR) {
            var message;
            if(jqXHR.responseJSON.error.message) {
                message = '* ' + jqXHR.responseJSON.error.message + '.';
            } else {
                message = '* Something went wrong.';
            }
            this.showError(message);
    	},

    	onLoginSuccess: function(response) {
    		Cookie.set('cmxUID', response.uid);
    		this.logged = true;
            $('#right_content').css("display","block");
            $('#left_content').css("display","block");
            $('.show_userName').text(response.userName);
    		$(window).trigger('ghostrunner.signin', response);
    		this.updateLoginButton();
    	},

    	onLogoutSuccess: function(UID) {
    		this.logged = false;
    		Cookie.remove('cmxUID');
            $("#right_content").css("display","none");
            $("#left_content").css("display","none");
            $('.show_userName').text('');
    		$(window).trigger('ghostrunner.signout', UID);
    		this.updateLoginButton();
    	},

        onAfterLogout: function() {
            this.logged = false;
            $('.show_userName').text('');
            this.updateLoginButton();
            // if (this.logged) {
            //     this.logoutUser(Cookie.get('cmxUID'));
            // }
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
                        this.showLoginError(jqXHR);
                    }
            }.bind(this));
        },

        loginUser: function (username, password) {
            return h().sendRequest(this.loginRequest, {
                payload: {
                    userid: username,
                    password: password
                }
            });
        },

        logoutUser: function(UID){
        	var UID = Cookie.get('cmxUID');
            return h().sendRequest(this.logoutRequest,{
                UID: UID
            }).then(this.onLogoutSuccess.bind(this, UID), 
                this.onLogoutSuccess.bind(this, UID));
        },
    };

    return loginManager;
});
