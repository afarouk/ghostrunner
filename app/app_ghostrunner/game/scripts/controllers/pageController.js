/*global define */

'use strict';

define([
    ], function( ){
    var PageController = Mn.Object.extend({
        initialize: function() {
            $( document ).ajaxStart(function() {
                var onLine = window.navigator.onLine;
                if (onLine === false && this.logged) {
                    if (window.pageName != 'BLOG') {
                        this.publicController.getStateController().onDestroy();
                    } else {
                        $(window).trigger('ghostrunner.afterLogout');
                    }
                }
            }.bind(this));
        },
        listenPage: function(){
            $(window).on('ghostrunner.signin', this.onSignin.bind(this));
            $(window).on('ghostrunner.signout', this.onSignout.bind(this));
            $('#back-to-page').click(this.backToPage.bind(this));
        },
        backToPage: function() { //temporary
            this.publicController.getGameController().backToPage();
        },
        onSignin: function(e, user) {
            this.device = this.publicController.getDevice();
            this.logged = true;
            this.publicController.getUrlController().checkOptions();
            if(window.pageName != 'BLOG') {
                if (this.device === 'mobile') {
                    this.publicController.getGameController().isMobile(user);
                } else {
                    this.publicController.getGameController().start(user);
                }       
            }
        },
        onSignout: function(e, UID) {
            this.logged = false; 
            if(window.pageName != 'BLOG') {              
                this.publicController.getGameController().stop(UID);
            }
        },
        setLoggedFalse: function() {
            this.logged = false;
        }
    });

    return new PageController();
});
