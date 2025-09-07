<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// imported DB connection
require __DIR__ . '/DataBase/dbConfig.php'; 

try {
    $stmt = $connect->query("SELECT id, fullName, password, email FROM users ORDER BY id DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
