<?php

include_once("connection.php");

if(isset($_POST['submit'])){
	$a=$_POST['CoID'];
	$b=$_POST['Full_name'];
	$c=$_POST['email'];
	$d=$_POST['phone'];
	$e=$_POST['company'];
	$f=$_POST['message'];
	
	if(mysql_query("INSERT INTO contact_tbl(CoID,Full_name,email,phone,company,message) VALUES ('$a','$b','$c','$d','$e','$f')"))
	{
	
		echo "Thank you for Choosing us; your order will be proccessed soon!";
		header("Location:contact.php");
		
	}
	else
	{
	
		echo "oops!!! sorry, the transaction failled. Try again";
		
	}
}
?>