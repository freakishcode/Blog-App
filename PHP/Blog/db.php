<?php
// Database connection
$host = "localhost";
$user = "myadmin";
$pass = "Bakare291";
$dbname = "blog_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
  die(json_encode(["error" => "Database connection failed."]));
} else{
   echo "Connected successfully!";
}

// Enable CORS (for frontend)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
?>
