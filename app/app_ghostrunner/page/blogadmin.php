<?php
  require_once('header.php');
?>
<script type="application/javascript">
  window.pageName = 'BLOG';
</script>
<!-- #header -->
<header  id="header" class="blog-page-header">
  <!-- #navigation -->
  <?php
    include_once("navbar.php");
  ?>
  <!-- #navigation end -->

  <!-- .header-content -->
  <div class="header-content">
    <div class="header-content-wrapper">
    	<div id="blog_edit" class="blog_content_left">
        <form class="form-horizontal" id="left_content" action="javascript:void(0)" method="post">
          <div class="form-group">
            <label class="control-label col-sm-2" for="Title">*Title</label>
            <div class="col-sm-10" >
              <input type="text" class="form-control" id="title"  name="title">
            </div>
          </div>

          <div class="form-group">
            <label class="control-label col-sm-2" for="Body">*Body</label>
            <div class="col-sm-10" >
              <textarea class="form-control" id="body" name="body" rows="5"></textarea>
            </div>
          </div>

          <div class="form-group">
            <label class="control-label col-sm-2" for="Links">Links</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="link"  placeholder="Hit enter to save url" name="link">
            </div>
          </div>

          <!-- <div class="form-group">
            <label class="control-label col-sm-2" for="Topics">*Topics</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="topics"  name="Topics">
            </div>
          </div>

          <div class="form-group">
            <label class="control-label col-sm-2" for="tags">*Tags</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="tags"  name="Tags">
            </div >
          </div> -->

          <div class="form-group">
              <label class="control-label col-sm-2" for="Add Picture">Add Picture</label>
            <div class="col-sm-10">
              <div class="dropzone" data-width="300" data-height="110" data-resize="true" data-save="false" style="height: 110px; width: 300px;">
                  <input type="file" id="blog_pic_inp" name="blog_pic">
              </div>
            </div>
          </div>

          <div id="error-message" class="form-group error-message">
            <span class="message-text"></span>
          </div>

          <div class="form-group">
              <div class="col-sm-offset-2 col-sm-10">
                <button id="blog_post_btn" type="button" class="btn  pull-right">Post</button>
                <button type="button" id="blog_cancel_btn" class="btn btn-default   pull-right">Cancel</button>
              </div>
          </div>
        </form>
      </div>

      <div id="blog_show" class="blog_content_right">
        <div id="right_content" class="blog_right_content">
          <div id="top_button">
            <button type="button" class="btn btn-danger pull-left" id="refresh" >Refresh</button>
            <button type="button" class="btn btn-danger pull-right" id="delete_blog">Delete</button>
          </div>
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

<!-- #about -->
<div id="about" class="wrap-container8060">
  <!-- .container -->

  <!-- .container end -->
</div>
<!-- #about end -->
<script>
	CKEDITOR.replace('body');
</script>
<?php
    require_once("footer.php");
?>
