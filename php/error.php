<?php
function ErrorMsg($msg){
	$logfilename = "error.log";
	$logfile = file_get_contents($logfilename);
	$logfile .= date("YmdHis:").$msg."\n";
	file_put_contents($logfilename, $logfile);

	$errdata["res"] = 0;

	echo json_encode($errdata);
	exit();
}

?>
