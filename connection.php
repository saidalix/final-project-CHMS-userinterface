<?php
$servername="localhost";
$username="root";
$password="";
$databasename="jose_db";

$connect=mysql_connect($servername,$username,$password) or die("Unable to connect to The Server");
$select_db=mysql_select_db($databasename)or die("Unable to connect to The Server");
?>
