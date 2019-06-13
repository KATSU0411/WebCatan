<?php
require_once(__DIR__."connect.php");
require_once(__DIR__."error.php");

function AddUser(string $username, string $password){
	$pdo->beginTransaction();
	try{
		$sql = 'INSERT INTO M_USER username, password VALUES(:username, :hash)';
		$hash = password_hash($password, PASSWORD_BCRYPT);

		$stmt = $pdo->prepare($sql);
		$stmt->bindValue(':username', $username);
		$stmt->bindValue(':hash', $hash);
		$stmt->execute();
		$stmt->commit();

	}catch(PDOException $e){
		$pdo->rollBack();
		ErrorMsg($e->getMessage());
	}

}
?>
