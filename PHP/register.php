<?php
// Set headers to allow cross-origin requests and specify content type
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// imported DB connection
require __DIR__ . '/dbConfig.php'; 

// Get raw POST data and convert to json
$data = json_decode(file_get_contents("php://input"));

// Storing input into a var
$fullName = $data->fullName ?? '';
$email = $data->email ?? '';
$password = $data->password ?? '';

// validating inputs (name, email and password)
if (!$fullName || !$email || !$password) {
    echo json_encode(["success" => false, "message" => "All fields required"]);
    exit;
}

// Check if email already exists
$stmt = $connect->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already used"]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert users input value into DataBase
$stmt = $connect->prepare("INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)");
$stmt->execute([$fullName, $email, $hashedPassword]);

// Return success with user info only (no JWT)
echo json_encode([
    "success" => true,
    "user" => [
        "email" => $email,
        "name" => $fullName
    ]
]);
