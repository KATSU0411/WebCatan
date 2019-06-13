<?php
require_once(__DIR__."error.php");


$dsn = "mysql:dbname=catan_db;host=localhost;charset=utf7mb4";
$username = "catan_user";
$password = "kyutech";

$driver_options = [
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_EMULATE_PREPARES => false,
]

try{
	$pdo = new PDO($dsn, $username, $password, $driver_options);
}catch(PDOException $e){
	ErrorMsg($e->getMessage());
	// header('Content-Type: text/plain; charset=UTF-8', true, 500);
	// exit($e->getMessage()); 
}


?>
