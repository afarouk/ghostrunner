<?php
include_once('./Mobile_Detect.php');
include_once('./parser_api_utility.php');
include_once('./detecturl.php');

$detect        = new Mobile_Detect;

if ((!$detect->isMobile() && !$detect->isTablet()) && !isset($desktopIFrame)) {
    $isDesktop=true;
} else {
    $isDesktop=false;
}

/* is API server specified? */
// if (validateParams('server')) {
//     $server = $_REQUEST['server'];
//     if (strcmp($server, 'localhost') === 0) {
//         $server = $server . ':8080';
//     }
// } else {
//     if ($demo) {
//         $server = 'simfel.com';
//     } else {
//         $server = 'communitylive.ws';
//     }
// }

// if (strpos($server, 'localhost') !== false) {
//     $protocol = 'http://';
//     $wsProtocol = 'ws://';
// } else {
//     $protocol = 'https://';
//     $wsProtocol = 'wss://';
// }

// if (validateParams('UID')) {
//     $UID = $_REQUEST['UID'];
// } else {
//     $UID = null;
// }
