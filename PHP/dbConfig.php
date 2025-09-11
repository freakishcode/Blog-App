<?php

// Host Name
$host = "localhost";
//Database Name
$dbname = "crud_db";
// Username
$username = "myadmin"; // or your MySQL username
// Password
$password = "Bakare291";


try {
    // Create connection to Database
    $connect = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
     // Set error mode
    $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully!";


}  catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
