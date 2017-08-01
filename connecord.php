<?php

include_once("connection.php");

if(isset($_POST['submit'])){
	$a=$_POST['ID'];
	$b=$_POST['Cus_full_name'];
	$c=$_POST['Cemail'];
	$d=$_POST['Item_name'];
	$e=$_POST['Quantity'];
	$f=$_POST['Size'];
	$g=$_POST['Color'];
	$h=$_POST['Type'];
	if(mysql_query("INSERT INTO ordering(ID,Cus_full_name,Cemail,Item_name,Quantity,Size,Color,Type) VALUES ('$a','$b','$c','$d','$e','$f','$g','$h')"))
	{
	
		echo "Thank you for Choosing us; your order will be proccessed soon!";
		header("Location:ordering.php");
		
	}
	else
	{
	
		echo "oops!!! sorry, the transaction failled. Try again";
		
	}
}
?>