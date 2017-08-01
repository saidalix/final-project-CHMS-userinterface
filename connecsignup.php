<?php
include_once("connection.php");
if(isset($_POST['submit'])){
	$a=$_POST['CusID'];
	$b=$_POST['Cfname'];
	$c=$_POST['Clname'];
	$d=$_POST['Cusername'];
	$e=$_POST['Cphone'];
	$f=$_POST['Cemail'];
	$g=$_POST['Cpass'];
	if(mysql_query("INSERT INTO customer_tbl(CusID,Cfname,Clname,Cusername,Cphone,Cemail,Cpass) VALUES ('$a','$b','$c','$d','$e','$f','$g')"))
	{
	
		echo "Thank you for Choosing us; you will not be deceived by our services!";
		header("Location:signup.php");
		
	}
	else
	{
	
		echo "oops!!! sorry, the transaction failled. Try again";
		
	}
}

?>