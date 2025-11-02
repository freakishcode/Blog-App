<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "./db.php"; // uses $pdo

try {
    $stmt = $pdo->query("SELECT id, title, content, author, image_url, created_at FROM posts ORDER BY created_at DESC");
    $posts = $stmt->fetchAll();

    echo json_encode($posts);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database query failed",
        "details" => $e->getMessage()
    ]);
}
