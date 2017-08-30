<?php
   require_once("header.php");
?>
<script src='https://www.google.com/recaptcha/api.js' async defer ></script>
<script type="application/javascript">

window.pageName = 'INDEX';

</script>
     <!-- #header -->
    <header  id="header" class="game-page-header">

        <!-- #navigation -->
       <?php
            include_once("navbar.php");
        ?>
        <!-- #navigation end -->
    <!-- .header-content -->
        <div class="header-content">
            <div class="header-content-wrapper">
               <!--
                <div class="header-content-tab-wrap">
                    <a href="#" class="header-content-tabs">Game Stats</a>
                    <a href="#" class="header-content-tabs">Partner Status</a>
                </div>
                -->
            	<div id="game-layout" class="game_canvas_wrap" ></div>
                <div id="game_right_layout" class="game_right_wrap" >
                    <div id="right_content" class="blog_right_content">
                        
                        <div id="blog_view_container" class="blog_view_container">

                            <div class="image_bg">
                                <h4 align="right" >Talkin' Baseball</br> with JimmyG</h4>
                            </div>
                            
                            <h4 id="header_blog_view"></h4>

                            <div id="nav_picture">
                                <img id="blog_picture" src="">
                            </div>

                            <p id="main_blog_view" ></p>
                            </div>
                            <div id="bottom_button_grp" class="bottom_button_grp">
                            <button type="button" class="btn btn-info next_prev_btn" id="blog_btn_prev" >&lt;Prev</button>
                            <button type="button" class="btn btn-info pull-right next_prev_btn" id="blog_btn_next">Next&gt;</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- .header-content end -->

    </header>
     <!-- #header end -->
    <!-- #about -->
    <div id="about" class="wrap-container8060">

        <!-- .container -->
        <div class="container">

            <div class="post-heading-center">
            	<h2>About Us</h2>
                <!--<p>Aenean bibendum erat sed dolor vehicula, nec dignissim ligula tincidunt. Nunc ullamcorper in purus pulvinar consequat. Aliquam eu porta enim.</p>-->
            </div>

            <!-- .row -->
            <div class="row">

                <div class="col-md-6 col-lg-5">
                	<figure class="padding-top30-md margin-bottom20">
                        <img src="images/content/landing/GR_logo_800_by_820.png" alt="Image" class="img-style-left" />
                    </figure>
                </div>

                <div class="col-md-6 col-lg-offset-1">
                	<div class="margin-bottom20">
                        <p>GhostRunner, LLC is a sports simulation company.  Our first offering, MatchUp Baseball,  is THE BEST baseball game that you can play (short of an actual baseball game).  Managing your favorite team (or a collection of all-stars), you decide when you want your slugger to go for the fences against the opponent's hurler, when you want your contact hitter to go to the opposite field, and when you want your speedster to run wild.  Because MatchUp is played in real time on virtually any mobile device, you can smack talk your opponent when your players come through with a big hit, or when they turn a rally-killing double play.  Best of all, once you start playing MatchUp, you'll want to invite all of your friends to "match up" against you.
                        <!--<p><strong>Sed ut perspiciatis</strong> unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>-->
                    </div>
                </div>

            </div>
            <!-- .row end -->

        </div>
        <!-- .container end -->

    </div>
    <!-- #about end -->

    <!--  #contact  -->

    <div id="contact" class="wrap-container8040">

        <!-- .container -->
        <div class="container">

            <!-- .row -->
            <div class="row">

                <div class="col-md-6">
                	<div class="margin-bottom40">
                        <div class="post-heading-left">
                            <h2>Start a Conversation</h2>
                            <!--<p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt quia voluptas.</p>-->
                        </div>

                        <form method="post" action="#" class="affa-form-contact" id="sendMessage">
                            <div class="submit-status"></div> <!-- submit status -->
                            <div class="row">
                                <div class="col-md-4">
                                    <input type="text" name="name" placeholder="[Name]">
                                </div>
                                <div class="col-md-5">
                                    <input type="text" name="email" placeholder="[Email Address *]">
                                </div>
                                <div class="col-md-3">
                                    <input type="text" name="promocode" placeholder="[Code]">
                                </div>
                            </div>
                            <input type="text" name="subject" placeholder="Subject">
                            <textarea name="message" placeholder="Message *" id="textarea"></textarea>
                            <div class="g-recaptcha" data-theme ="dark" data-sitekey="6LfJtS0UAAAAABs4-RYVQPzXOV8yTj0heSrtfqMg"></div>
                            <br>
                            <input type="submit" name="submit" value="Send Message">
                        </form>
                    </div>
                </div>

                <div class="col-md-6">
                	<div class="margin-bottom40">
                        <div class="post-heading-left">
                            <!--<h2>Find Our Location</h2>
                            <p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt quia voluptas.</p>-->
                        </div>
                </div>

            </div>
            <!-- .row end -->

        </div>
        <!-- .container end -->

    </div>

    <!--  #contact end  -->
    <?php
        require_once("footer.php");
    ?>
