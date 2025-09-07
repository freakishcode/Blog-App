<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // For testing only. Change for production.
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Include Your DB config file
require __DIR__ . '/DataBase/dbConfig.php'; 

// Get raw POST data
$data = json_decode(file_get_contents("php://input"));

// Validate input
$email = $data->email ?? '';
$password = $data->password ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Email and password required"]);
    exit;
}

// Query database
$stmt = $connect->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    // Return success response with user info only (no JWT)
    echo json_encode([
        "success" => true,
        "user" => [
            "email" => $user['email'],
            "name" => $user['fullName'],
            "id" => $user['id']
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}

