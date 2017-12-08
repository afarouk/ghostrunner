<?php

function echoActiveClassIfRequestMatches($requestUri, $anchortag)
{
    $current_file_name = basename($_SERVER['REQUEST_URI'], ".php");

    if ($current_file_name == $requestUri || $current_file_name==""){
         echo '"#'.$anchortag.'"';
    }else{
        echo '"index.php#'.$anchortag.'"';
    }
       // echo 'class="active"';
}


function modifyUrlAndClass($requestUri)
{
    /* $current_file_name = basename($_SERVER['REQUEST_URI'], ".php"); */
    $current_file_name = basename($_SERVER['REQUEST_URI'], ".php");  
    if ($current_file_name == $requestUri)
        echo 'class="active"';
}
?>
