<?php

// Database configuration
$host = "localhost";// Host Name
$dbname = "crud_db";//Database Name
$username = "myadmin"; // or your MySQL username
$password = "Bakare291"; // Password


try {
    // Create connection to Database
    $connect = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
     // Set error mode
    $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      // ✅ Echo success message (for development/debugging only)
    echo "Connected successfully!";


}  catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed:"]);

     // For debugging only (disable in production)
    echo json_encode(["error" => $e->getMessage()]);
    exit();
}
