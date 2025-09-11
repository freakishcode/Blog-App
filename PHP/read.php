<?php
// get_users.php

header("Content-Type: application/json");
// allow CORS (adjust for production)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");


// ✅ imported DB connection with PDO
require __DIR__ . '/dbConfig.php'; 

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "status" => false,
        "message" => "Method Not Allowed"
    ]);
    exit;
}


// ✅ Fetch all users
try {
    $stmt = $connect->query("SELECT id, full_name, email, gender, phone, created_at FROM crud_users ORDER BY id DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => true,
        "users" => $users
    ]);

} catch (PDOException $e) {
    http_response_code(500);
     echo json_encode([
        "status" => false,
        "message" => "Failed to fetch users"
    ]);
}
