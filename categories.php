<ul class="left_menu">

<table width="180" data-toggle="table">
						    
						    <?php
include ("connection.php");

$strquery="SELECT * from  category";
$results=mysql_query($strquery);
$num=mysql_num_rows($results);

$i=0;
while ($i< $num)

{
$b=mysql_result($results,$i,"category");

?>

<tr>
<td><li class="odd"><a href="cements.php"><?php echo $b ; ?></a></li></td> 
<td><a href="paint.php"></a></td> 
<td><a href="paint.php"></a></td> 
<td><a href="paint.php"></a></td> 
</tr>

<?php

  $i++;
  }
  ?>
<tr>
<td> </td>
</tr>

						</table>

                          </ul>
