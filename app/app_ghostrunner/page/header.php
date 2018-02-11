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


<head>
  <title>GhostRunner</title>
  <meta name="description" content="" />
  <meta name="keywords" content="" />
  <meta name="author" content="GhostRunner" />
  <!-- splash screen for IOS, but apple hasn't fixed their bugs -->
  <link rel="apple-touch-startup-image" href="Default-portrait@2x~iphone5.png">

  <!-- web-app settings -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <!-- App Icon or WebClip icon -->
  <link rel="apple-touch-icon"  href="images/apple-touch-icon-192x192.png" />
  <link rel="icon" sizes="192x192" href="images/apple-touch-icon-192x192.png" />

  <link rel="apple-touch-icon" href="images/apple-touch-icon-192x192.png" />
  <link rel="apple-touch-icon" sizes="72x72" href="images/apple-touch-icon-72x72.png" />
  <link rel="apple-touch-icon" sizes="114x114" href="images/apple-touch-icon-114x114.png" />
  <link rel="apple-touch-icon" sizes="192x192" href="images/apple-touch-icon-192x192.png" />

  <!-- favIcon -->
  <link rel="icon" href="images/favicon.ico" />
  <link rel="shortcut icon" href="images/favicon.ico" />

  <!-- Sharing meta data for Facebook / Twitter etc -->
  <meta name="description" content="GhostRunner" />
  <meta name="keywords" content="GhostRunner" />
  <meta name="author" content="GhostRunner.net" />


  <meta property="og:type"               content="article" />
  <meta property="og:title"              content=""/>
  <meta property="og:description"        content=""/>
  <meta property="og:image"              content=""/>
  <meta property="og:url"                content=""/>

  <meta name="twitter:card"              content=""/>
  <meta name="twitter:site"              content=""/>
  <meta name="twitter:creator"           content=""/>
  <meta name="twitter:title"             content=""/>
  <meta name="twitter:description"       content=""/>
  <meta name="twitter:image"             content=""/>
  <meta name="twitter:url"               content=""/>

  <!--  End sharing meta data -->
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Poppins:400,300,600,700" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />

    <!-- Stylesheets -->
    <link rel="stylesheet" href="./bundle.css" />

    <style  type="text/css">
        <?php
            if ($isDesktop) {
                include_once('desktop.css');
            } else {
                include_once('mobile.css');
            }
        ?>
    </style>

    <noscript><link rel="stylesheet" href="css/no-js.css"></noscript>



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
        window.ghostrunner = {};
        window.ghostrunner.isDesktop = <?php echo  $isDesktop==true ? 'true':'false' ?>;
    </script>
	<script src="http://cdn.ckeditor.com/4.5.5/standard/ckeditor.js"></script>
</head>
