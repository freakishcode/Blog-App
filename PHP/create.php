<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // allow CORS (adjust for production)
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// ✅ imported DB connection with PDO
require __DIR__ . '/dbConfig.php'; 

// ✅ Get raw POST data
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

// ✅ Extract fields
$full_name = trim($input["full_name"] ?? "");
$email     = trim($input["email"] ?? "");
$gender    = trim($input["gender"] ?? "");
$phone     = trim($input["phone"] ?? "");

// ✅ Basic validation
$errors = [];

if (empty($full_name)) {
    $errors[] = "Full name is required";
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}
if (empty($gender)) {
    $errors[] = "Gender is required";
}
if (!preg_match('/^\d{11}$/', $phone)) {
    $errors[] = "Phone must be 11 digits";
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(["errors" => $errors]);
    exit();
}

// ✅ Insert into DB using prepared statement
try {
    $stmt = $connect->prepare("INSERT INTO crud_users (full_name, email, gender, phone) VALUES (:full_name, :email, :gender, :phone)");
    $stmt->execute([
        ":full_name" => $full_name,
        ":email"     => $email,
        ":gender"    => $gender,
        ":phone"     => $phone,
    ]);

    echo json_encode(["message" => "User added successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to insert user: " . $e->getMessage()]);
}
