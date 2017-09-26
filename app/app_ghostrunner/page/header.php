<?php
    $serverName  = $_SERVER['SERVER_NAME'];
    /* temporary facebook appId by is production or not */
    /* facebook logout won't work on localhost probably */
    $FacebookAppId = '774315829423417';
    if ($serverName === 'ghostrunner.net') {
        $FacebookAppId = '1967745540176798';
    }
    /*  ...  */
?>
<!DOCTYPE html>
<!--[if lt IE 7]><html class="ie ie6" lang="en"><![endif]-->
<!--[if IE 7]><html class="ie ie7" lang="en"><![endif]-->
<!--[if IE 8]><html class="ie ie8" lang="en"><![endif]-->
<!--[if IE 9]><html class="ie9" lang="en"><![endif]-->
<!--[if (gte IE 10)|!(IE)]><!--><html lang="en"><!--<![endif]-->

<head>

    <title>GhostRunner</title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <meta name="author" content="GhostRunner" />

    <!-- Mobile Specific Meta -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Poppins:400,300,600,700" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="./styles.css">
    
    <!-- Custom Colors -->
    <!--<link rel="stylesheet" href="css/colors/blue/color.css">-->
    <!--<link rel="stylesheet" href="css/colors/green/color.css">-->
    <!--<link rel="stylesheet" href="css/colors/pink/color.css">-->
    <!--<link rel="stylesheet" href="css/colors/purple/color.css">-->
    <!--<link rel="stylesheet" href="css/colors/yellow/color.css">-->

    <!--[if lt IE 9]>
    	<script src="js/html5.js"></script>
        <script src="js/respond.min.js"></script>
	<![endif]-->

    <!--[if lt IE 8]>
    	<link rel="stylesheet" href="css/ie-older.css">
    <![endif]-->

    <noscript><link rel="stylesheet" href="css/no-js.css"></noscript>

    <!-- Favicons -->
	<link rel="shortcut icon" href="images/favicon.ico">
	<link rel="apple-touch-icon" href="images/apple-touch-icon.png">
	<link rel="apple-touch-icon" sizes="72x72" href="images/apple-touch-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="114x114" href="images/apple-touch-icon-114x114.png">
    
    <!-- js for facebook login-->
    <script src="https://connect.facebook.net/en_US/sdk.js"></script>
    <!-- js for facebook login-->
    <script>
        window.fbAsyncInit = function() {
          FB.init({
            appId      : '<?php echo $FacebookAppId ?>',
            cookie     : true,
            status     : true,
            xfbml      : true,
            version    : 'v2.10'
          });
        }
    </script>
</head>
<body>
   
   
