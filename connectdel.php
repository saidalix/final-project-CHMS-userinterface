<?php
include_once("connection.php");

if(isset($_POST['submit'])){
	$a=$_POST['DID'];
	$b=$_POST['Cus_full_name'];
	$c=$_POST['Cemail'];
	$d=$_POST['Cphone'];
	$e=$_POST['Address'];
	$f=$_POST['Item_Quantity'];
	if(mysql_query("INSERT INTO delivery_tbl(DID,Cus_full_name,Cemail,Cphone,Address,Item_Quantity) VALUES ('$a','$b','$c','$d','$e','$f')"))
	{
	
		echo "Thank you for Choosing us; your information have been saved!";
		header("Location:delivery.php");
		
	}
	else
	{
	
		echo "oops!!! sorry, the transaction failled. Try again";
		
	}
}

?>