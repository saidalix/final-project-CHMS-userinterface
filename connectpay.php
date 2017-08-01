<?php

include_once("connection.php");

if(isset($_POST['submit'])){
	$a=$_POST['PID'];
	$b=$_POST['Cus_full_name'];
	$c=$_POST['Cemail'];
	$d=$_POST['Cphone'];
	$e=$_POST['Address'];
	$f=$_POST['Occupation'];
	$g=$_POST['Mpayement'];
	$h=$_POST['Item_name'];
	$i=$_POST['amount'];
	if(mysql_query("INSERT INTO payement_tbl(PID,Cus_full_name,Cemail,Cphone,Address,Occupation,Mpayement,Item_name,amount) VALUES ('$a','$b','$c','$d','$e','$f','$g','$h','$i')"))
	{
	
		echo "Thank you for Choosing us; your payement will be proccessed soon!";
		header("Location:ordering.php");
		
	}
	else
	{
	
		echo "oops!!! sorry, the transaction failled. Try again";
		
	}
}
?>