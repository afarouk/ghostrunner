(function($){
	'use strict';

	var loginManager = {
		logged: false,
		file: '',
        fileName : '',
		//API
		// apiRoot: 'https://simfel.com/apptsvc/rest',
        apiRoot: 'http://54.191.91.125/apptsvc/rest',
		loginRequest: ['POST', '/gaming/login'],
		registerRequest: ['POST', '/gaming/registerNewMember'],
        logoutRequest: ['GET', '/gaming/logout'],
        loginWithFacebookRequest: ['POST', '/authentication/exchangeFacebookIdForUID'],
        usernameAvailable:['GET', '/authentication/isUserNameAvailable'],
        userForgotPassword: ['PUT', '/authentication/sendEmailForResetPassword'],
        registerNewMember: ['POST', '/authentication/registerNewMemberViaPostBody'],
        getAuthenticationStatus: ['GET', '/gaming/getAuthenticationStatus'],
        BlogRequest:['POST', '/gaming/createBlogEntry'],
        retrieveRequest:['GET', '/gaming/retrieveBlog'],
        DeleteEntry:['PUT','/gaming/deactivateBlogEntry'],
        SendContactUsEmail:['POST','/gaming/sendContactUsEmail'],
	
        
	    init: function() {
            var params = this.parseQueryString(window.location.search),UID;
			 this.listenLogin();
			 this.listenRegister();
                         this.listenContact();
            if(window.pageName == 'BLOG' || window.pageName == 'INDEX'){ 
                this.checkingBlog();  
                this.listenBlog();
            }
                    
            if(params && params.UID){
                this.autoLoginByUID(params.UID);
            }else if(Cookie.get('cmxUID')) {
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

        autoLoginByUID: function (UID) {
            this.sendRequest(this.getAuthenticationStatus, {UID: UID})
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
                $('#error_dv').hide();
                $('#success_dv').hide();
            });
	    	$('#signup .register').on('click', function(){
	    		var username = $('#signup [name="userName"]').val(),
	    			password = $('#signup [name="userPassword"]').val(),
                    cpass    = $('#signup [name="userConfirmPassword"]').val();
                if(username.trim()==""){
                    $('#error_dv').text('Please enter your username or email.');
                    $('#error_dv').show();
                    return false;
                }else if(password.trim()!=cpass.trim()){
                    $('#error_dv').text('Confirm password not matched.');
                    $('#error_dv').show();
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
                   
                    }.bind(this));
	    },
        
        loginUserWithFacebook: function(publicProfile) {
            return this.sendRequest(this.loginWithFacebookRequest, {
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
            return this.sendRequest(this.registerRequest, {
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
			$('#error_dv').text(message);
            $('#error_dv').show();
		},
        
        showLoginError: function() {
			//TODO show login error
			console.log('login error');
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
            }).then(this.onLogoutSuccess.bind(this, UID), 
                this.onLogoutSuccess.bind(this, UID));
        },

        getAPIRoot: function() {
        	var search = window.location.search,
        		params = this.parseQueryString(search),
        		server;
        	if (params && params.server) {
        		server = params.server;
        	}
		      if(server=='localhost:8080'){
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
        },
        
        createBlog: function(data){
                var UID=Cookie.get('cmxUID');
                var option ={
                    url : this.BlogRequest[1] + '?UID='+UID,
                    data : data,
                    method : this.BlogRequest[0]
	};
                return this.sendMultipart(option);
                 },
        
        listenBlog: function(){
            this.retriveBlog(null,null);  
            var that = this;
            $('.dropzone').html5imageupload({
              ghost: false,
              save: false,
              canvas: true,
              data: {},
              resize: false,
              onSave: this.onSaveImage.bind(this),
              onAfterCancel: function() {
                  that.file = null;
              }
          });
            
            $('#refresh').on("click",function(){
                this.retriveBlog(null,null);
            }.bind(this));
            
            $('#blog_btn_next').on('click',function(){
                var next = $('#blog_btn_next').attr('navId');
                this.retriveBlog(null,next);
            }.bind(this));
            
            $('#blog_btn_prev').on('click',function(){
                var prev = $('#blog_btn_prev').attr('navId');
                this.retriveBlog(prev , null);
            }.bind(this));
            
            $('#delete_blog').on('click',function(){
                this.sendRequest(this.DeleteEntry, {UID:Cookie.get('cmxUID'),blogUUID:$('#delete_blog').attr('bloguuid')}).then(function(response){
                    alert("Blog Entry Deleted Successfully");
                    this.retriveBlog(null,null);
                }.bind(this),function(){
                    alert("Error");
                })
            }.bind(this));
            
            $("#blog_post_btn").on("click",function(){
                var title = '';
                var body  = '';
                var link  = '';
                var topic = '';
                var tags  = '';
               title = $("#title"); 
               body = $("#body");
               link = $("#link").val();
               topic = $("#topics");
               tags = $("#tags");
                
            if(title.val()==""){
                    alert("Title should not be empty.");
                    title.focus();
                    return false;
                }
            else if(body.val() ==""){
                    alert("Body should not be empty.");
                    body.focus();
                    return false;
                }
            else if(topic.val() ==""){
                alert("Topic should not be empty.");
                topic.focus();
                return false;
            }
            else if(tags.val()==""){
                alert("Tags should not be empty.");
                tags.focus();
                 return false;
            }
            else
            {
                var d = new Date();
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1;
                curr_month = curr_month<10 ? '0'+curr_month : curr_month;
                var curr_year = d.getFullYear();
                var h = d.getHours();
                var m = d.getMinutes();
                var s = d.getSeconds();
                var fulldate = curr_year+'-'+curr_month+'-'+curr_date+' '+h+':'+m+':'+s;
                var data ={
                        activationDate: fulldate,
                        expirationDate: fulldate,
                        contestName:title.val(),
                        displayText:body.val(),
                        isAnonymous: false,
                        subType:2,
                        categories:null,
                        hashTags:null
                    };
                   this.createBlog(data).then(function(response) {
                        alert("Blog created Successfully");
                        this.retriveBlog(null,null);
                        this.blogReset();
                    }.bind(this)); 
            }
         }.bind(this));  
            
            $("#blog_cancel_btn").on('click',function(){
                 this.blogReset();
            }.bind(this));
        },
        
        onSaveImage: function(image) {
          this.file = this.dataURLtoBlob(image.data);
          this.fileName = image.name;
        },
        
        blogReset:function(){
           $('.form-horizontal')[0].reset();
           $(".btn-del").click();
       },
        
        sendMultipart: function(options){
             var data      = options.data ? JSON.stringify(options.data) : '';
             var url       = this.getAPIRoot() + options.url;
             var method    = options.method;
             var formData = new FormData();
             if(this.file){
             formData.append('image', this.file,this.fileName);    
             }
            
             if(data){
             formData.append('data', data);    
             }
             return $.ajax({
                        type: method,
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: formData,
                        url: url ,
                        timeout: 10000
                    });
            
        },
        
        dataURLtoBlob: function(data) {
     
         if(!data || data ===undefined){
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
 
        checkingBlog: function(){
            var UID = Cookie.get('cmxUID');
            if(UID){
                $('#right_content').show();
                $('#left_content').show();
            }
        },
        
        retriveBlog: function(preId,nxtId) {
            
            preId = preId !=null ? preId : 0 ;
            nxtId = nxtId !=null ? nxtId : 0 ;
            $('#blog_btn_next').attr('navId','');
            $('#blog_btn_prev').attr('navId','');
            $('#header_blog_view').html('');
            $('#blog_picture').attr('src','');
            $('#main_blog_view').html('');
            $('#delete_blog').attr('bloguuid','');
            this.sendRequest(this.retrieveRequest, {previousId:preId,nextId:nxtId})
	            .then(function (response) {
                    if(response.hasNext===true){
                           $('#blog_btn_next').attr('disabled',false); 
                        }else{
                           $('#blog_btn_next').attr('disabled',true); 
                        }
                        if(response.hasPrevious===true){
                           $('#blog_btn_prev').attr('disabled',false); 
                        }else{
                           $('#blog_btn_prev').attr('disabled',true);
                        }
	                if(response && response.entries.length>0){
                        
                        $('#blog_btn_next').attr('navId',response.previousId);
                        $('#blog_btn_prev').attr('navId',response.nextId);
                        $('#delete_blog').attr('bloguuid',response.entries[0].uuid);
                        $('#header_blog_view').html(response.entries[0].title);
                        $('#blog_picture').attr('src',response.entries[0].img_url);
                        $('#main_blog_view').html(response.entries[0].body);
                    }else{
                      $('#delete_blog').attr('disabled',true);  
                    }
                
	            }.bind(this), function onRequestError (error) {
	               console.log(error);
	            });
        },
        
        SendMessage: function() {
            
            var Name = $('input[name="name"]').val();
            var Email = $('input[name="email"]').val();
            var Subject = $('input[name="subject"]').val();
            var Message = $('#textarea').val();
            var promocode = $('input[name="promocode"]').val();
           this.sendRequest(this.SendContactUsEmail,{
               payload:{
                   name:Name,
                   email:Email,
                   subject:Subject,
                   message:Message,
                   code:promocode,
           } }).then(function(response){
               alert(response.explanation);
               $("#sendMessage")[0].reset();
            }.bind(this)); 
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
            });
        }
    };
	$(document).ready( function() {
		loginManager.init();
	});
})(window.jQuery)
