<?php
// get_users.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // allow CORS (adjust for production)

// ✅ imported DB connection with PDO
require __DIR__ . '/dbConfig.php'; 


// ✅ Fetch all users
try {
    $stmt = $connect->query("SELECT id, full_name, email, gender, phone, created_at FROM crud_users ORDER BY id DESC");
    $users = $stmt->fetchAll();

    echo json_encode($users);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch users: " . $e->getMessage()]);
}
