<?php
include_once("connection.php");
if(isset($_POST['Submit'])){
$Cusername=$_POST['Cusername'];
$Cpass=$_POST['Cpass'];

$sql=mysql_query("select * from customer_tbl where Cusername = '$Cusername' AND Cpass = '$Cpass'");
if(mysql_num_rows($sql)== 0){
$report= "Sorry this Email or Password is incorrect";
}
else{
$row = mysql_fetch_array($sql);
$_SESSION['Cusername'] == $row[Cusername];
$_SESSION['Cpass'] == $row[Cpass];
$report = header("location: ordering.php");
}}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>CHBMS - My Account</title>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252" />
<link rel="stylesheet" type="text/css" href="style.css" />
<!--[if IE 6]>
<link rel="stylesheet" type="text/css" href="iecss.css" />
<![endif]-->
<script type="text/javascript" src="js/boxOver.js"></script>
</head>
<body>
<div id="main_container">
  <div class="top_bar">
    <div class="top_search">
      <div class="search_text"><a href="#">Advanced Search</a></div>
      <input type="text" class="search_input" name="search" />
      <input type="image" src="images/search.gif" class="search_bt"/>
    </div>
    <div class="languages">
      <div class="lang_text">Languages:</div>
      <a href="#" class="lang"><img src="images/en.gif" alt="" border="0" /></a> <a href="#" class="lang"><img src="images/de.gif" alt="" border="0" /></a> </div>
  </div>
  <div id="header">
    <div id="logo"> <a href="#"><img src="images/logo.png" alt="" border="0" width="237" height="140" /></a> </div>
    <div class="oferte_content">
      <div class="top_divider"><img src="images/header_divider.png" alt="" width="1" height="164" /></div>
      <div class="oferta">
        <div class="oferta_content"> <img src="images/laptop.png" width="94" height="92" alt="" border="0" class="oferta_img" />
          <div class="oferta_details">
            <div class="oferta_title"><strong>Jose Maria Hardware Building Center</strong></div>
            <div class="oferta_text"> Hardware Building Materials Center </div>
             </div>
        </div>
        <div class="oferta_pagination"> <span class="current">1</span> <a href="#">2</a> <a href="#">3</a> <a href="#">4</a> <a href="#">5</a> </div>
      </div>
      <div class="top_divider"><img src="images/header_divider.png" alt="" width="1" height="164" /></div>
    </div>
    <!-- end of oferte_content-->
  <?php include ("header.php"); ?>
    <!-- end of menu tab -->
    <div class="crumb_navigation"> Navigation: <a href="index.php">Home</a> &lt; <span class="current">Category name</span> </div>
    <div class="left_content">
      <div class="title_box">Categories</div>
     <!-- categories -->
      <?php include ("categories.php") ?>
      
     
      <div class="title_box">Newsletter</div>
      <div class="border_box">
        <input type="text" name="newsletter" class="newsletter_input" value="your email"/>
        <a href="#" class="join">join</a> </div>
      <div class="banner_adds"> <a href="#"><img src="images/bann2.jpg" alt="" border="0" /></a> </div>
    </div>
    <!-- end of left content -->
    <div class="center_content">
      <div class="center_title_bar">Login</div>
      <div class="prod_box_big">
        <div class="top_prod_box_big"></div>
        <div class="center_prod_box_big">
          <div class="contact_form">
          <form method="POST">
            <div class="form_row">
              <label class="contact"><strong>Username:</strong></label>
              <input type="text" class="contact_input" name="Cusername" id="Cusername" />
            </div>
            <div class="form_row">
              <label class="contact"><strong>Password:</strong></label>
              <input type="Password" class="contact_input" name="Cpass" id="Cpass" />
            </div>
            <div class="form_row">
              
            </div>
            <div class="form_row">
             
            </div>
            <div class="form_row">
              
            </div>
            <div class="form_row"> <input type="submit" name="Submit" value="Login"> </div>
            </form>
          </div>
        </div>
        <div class="bottom_prod_box_big"></div>
      </div>
    </div>
    <!-- end of center content -->
    <div class="right_content">
      <div class="shopping_cart">
        <div class="cart_title">Shopping cart</div>
        <div class="cart_details"> 3 items <br />
          <span class="border_cart"></span> Total: <span class="price">350$</span> </div>
        <div class="cart_icon"><a href="#" title="header=[Checkout] body=[&nbsp;] fade=[on]"><img src="images/shoppingcart.png" alt="" width="48" height="48" border="0" /></a></div>
      </div>
      <div class="title_box">What’s new</div>
      <div class="border_box">
        <div class="product_title">Motorola 156 MX-VL</div>
        <div class="product_img"><a href="#"><img src="images/p2.gif" alt="" border="0" /></a></div>
        <div class="prod_price"><span class="reduce">350$</span> <span class="price">270$</span></div>
      </div>
     <?php include ("manufacture.php"); ?>
    <!-- end of right content -->
  </div>
  <!-- end of main content -->
   <?php include ("footer.php"); ?>
<!-- end of main_container -->
</body>
</html>
