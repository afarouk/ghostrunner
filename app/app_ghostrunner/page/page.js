/*global define*/
'use strict';

//require styles
require('./css/bootstrap.min.css');
require('./css/font-awesome.min.css');
require('./css/slick.css');
require('./css/slick-theme.css');
require('./css/jquery.fancybox.css');
require('./css/html5imageupload.css');
require('./css/style.css');
require('file?name=[name].[ext]!./index.php');
require('file?name=[name].[ext]!./blogadmin.php');
require('file?name=[name].[ext]!./header.php');
require('file?name=[name].[ext]!./footer.php');
require('file?name=[name].[ext]!./.htaccess');
require('file?name=[name].[ext]!./privacypolicy.php');
require('file?name=[name].[ext]!./termsandcondiction.php');
require('file?name=[name].[ext]!./navbar.php');

//require scripts
require('./js/jquery-1.11.3.min');
require('./js/jquery-migrate-1.2.1.min');
require('./js/bootstrap.min');
require('./js/jquery.easing.min');
require('./js/smoothscroll');
require('./js/response.min');
require('./js/jquery.placeholder.min');
require('./js/jquery.fitvids');
require('./js/jquery.imgpreload.min');
require('./js/waypoints.min');
require('./js/slick.min');
require('./js/jquery.mousewheel-3.0.6.pack');
require('./js/jquery.fancybox.pack');
require('./js/jquery.fancybox-media');
require('./js/parallax.min');
require('./js/html5imageupload.js');
require('./js/script');

define([
	'./js/login',
	'./js/blog'
	], function(login, blog){

	$(document).ready( function() {
		login.init();
		blog.init();
	});
});