<?php
   require_once("header.php");
?>
<script type="application/javascript">

window.pageName = 'INDEX';

</script>
     <!-- #header -->
    <header  id="header">

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
            	<div id="game_right_layout" class="game_right_wrap" ></div>
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
                        <p>GhostRunner, LLC is a sports simulation company.  Our first offering, MatchUp Baseball, is the most satisfying baseball game you can play.  Managing your favorite team (or a collection of all-stars), you decide when you want your slugger to go for the fences against the opponent's hurler, when you want your contact hitter to go to the opposite field, and when you want your speedster to run wild.  Because MatchUp is played in real time on virtually any mobile device, you can smack talk your opponent when your players come through with a big hit, or when they turn a rally-killing double play.  Best of all, once you start playing MatchUp, you'll want to invite all of your friends to "match up" against you.
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
                            <h2>Leave Us a Message</h2>
                            <!--<p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt quia voluptas.</p>-->
                        </div>

                        <form method="post" action="#" class="affa-form-contact" id="sendMessage">
                            <div class="submit-status"></div> <!-- submit status -->
                            <div class="row">
                                <div class="col-md-6">
                                    <input type="text" name="name" placeholder="Your Name">
                                </div>
                                <div class="col-md-6">
                                    <input type="text" name="email" placeholder="Email Address *">
                                </div>
                            </div>
                            <input type="text" name="subject" placeholder="Subject">
                            <textarea name="message" placeholder="Message *" id="textarea"></textarea>
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