/*global define*/

'use strict';

define([
    './helpers'
    ], function(h) {
    var blog = {
        file: '',
        fileName : '',
        BlogRequest:['POST', '/gaming/createBlogEntry'],
        retrieveBlogRequest:['GET', '/gaming/retrieveBlog'],
        DeleteEntry:['PUT','/gaming/deactivateBlogEntry'],

        init: function() {
            if (window.pageName == 'BLOG' || window.pageName == 'INDEX'){ 
                this.checkingBlog();  
                this.listenBlog();
            }
        },

        createBlog: function(data) {
            var UID=Cookie.get('cmxUID');
            var option = {
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
            
            $('#delete_blog').on('click',function() {
                h().sendRequest(this.DeleteEntry, {UID:Cookie.get('cmxUID'), blogUUID: $('#delete_blog').attr('bloguuid')})
                    .then(function(response){
                        this.showPopup('Blog Entry Deleted Successfully.');
                        this.retriveBlog(null,null);
                    }.bind(this), function() {
                        // this.showPopup(err.error.message, 'error');
                    });
            }.bind(this));

            $('#blog_edit .form-group .form-control').on('keydown', function(){
                this.hideError();
            }.bind(this));
            
            $('#blog_post_btn').on('click', function() {
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
                
                if(title.val() === '') {
                    this.showError('Title should not be empty.');
                    title.focus().addClass('error');
                    return false;
                } else if(body.val() === '') {
                    this.showError('Body should not be empty.');
                    body.focus().addClass('error');
                    return false;
                } else if(topic.val() === '') {
                    this.showError('Topic should not be empty.');
                    topic.focus().addClass('error');
                    return false;
                } else if(tags.val() === '') {
                    this.showError('Tags should not be empty.');
                    tags.focus().addClass('error');
                    return false;
                } else {
                    var d = new Date();
                    var curr_date = d.getDate();
                    var curr_month = d.getMonth() + 1;
                    curr_month = curr_month < 10 ? '0' + curr_month : curr_month;
                    var curr_year = d.getFullYear();
                    var hours = d.getHours();
                    var minutes = d.getMinutes();
                    var seconds = d.getSeconds();
                    var fulldate = curr_year + '-' + curr_month + '-' + curr_date + ' ' + hours + ':' + minutes + ':' + seconds;
                    var data = {
                            activationDate: fulldate,
                            expirationDate: fulldate,
                            contestName: title.val(),
                            displayText: body.val(),
                            isAnonymous: false,
                            subType: 2,
                            categories: null,
                            hashTags: null
                        };

                    h().showLoader();
                    this.createBlog(data)
                        .then(function(response) {
                            h().hideLoader();
                            this.showPopup('Blog created Successfully.');
                            this.retriveBlog(null,null);
                            this.blogReset();
                        }.bind(this)); 
                }
            }.bind(this));

            $('#blog_cancel_btn').on('click', function() {
                this.blogReset();
            }.bind(this));
        },
        
        onSaveImage: function(image) {
            this.file = h().dataURLtoBlob(image.data);
            this.fileName = image.name;
        },
        
        blogReset:function(){
            $('.form-horizontal')[0].reset();
            $(".btn-del").click();
        },
        
        sendMultipart: function(options){
            var data      = options.data ? JSON.stringify(options.data) : '';
            var url       = h().getAPIRoot() + options.url;
            var method    = options.method;
            var formData = new FormData();
            if(this.file) {
                formData.append('image', this.file,this.fileName);    
            }
            
            if (data) {
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
            h().sendRequest(this.retrieveBlogRequest, {previousId: preId, nextId: nxtId})
                .then(function (response) {
                    if (response.hasNext === true) {
                           $('#blog_btn_next').attr('disabled',false); 
                    } else {
                       $('#blog_btn_next').attr('disabled',true); 
                    }
                    if (response.hasPrevious === true) {
                       $('#blog_btn_prev').attr('disabled',false); 
                    } else {
                       $('#blog_btn_prev').attr('disabled',true);
                    }
                    if (response && response.entries.length > 0) {
                        $('#blog_btn_next').attr('navId',response.previousId);
                        $('#blog_btn_prev').attr('navId',response.nextId);
                        $('#delete_blog').attr('bloguuid',response.entries[0].uuid);
                        $('#header_blog_view').html(response.entries[0].title);
                        $('#blog_picture').attr('src',response.entries[0].img_url);
                        $('#main_blog_view').html(response.entries[0].body);
                    } else {
                        $('#delete_blog').attr('disabled', true);  
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

            h().sendRequest(this.SendContactUsEmail, {
                payload: {
                    name: Name,
                    email: Email,
                    subject: Subject,
                    message: Message,
                    code: promocode
                }
            }).then(function(response){
                this.showPopup(response.explanation);
                $("#sendMessage")[0].reset();
            }.bind(this)); 
        },

        showError: function(message) {
            var $el = $('#error-message');
            $el.find('.message-text').text('* ' + message);
            $el.show();
        },
        hideError: function() {
            var $el = $('#error-message');
            $el.find('.message-text').text('');
            $el.hide();
            $('#blog_edit .form-group .form-control').removeClass('error');
        },

        showPopup: function(message, type) {
            var $el;
            if (type === 'error') {
                $el = $('#error-msg');
            } else {
                $el = $('#info-msg');
            }
            $el.find('.message-text').text(message);
            $el.modal()
                .off('shown.bs.modal')
                .on('shown.bs.modal', function() {
                    //focuses on modals ok button
                    $(this).find('input').focus();
            });
        }
    };

    return blog;
});
