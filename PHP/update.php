<?php
// edit.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ imported DB connection with PDO
require __DIR__ . '/dbConfig.php'; 


// ✅ Get ID from URL
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing ID"]);
    exit();
}
$id = intval($_GET['id']);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // ✅ Fetch user by ID
    $stmt = $connect->prepare("SELECT id, full_name, email, gender, phone FROM crud_users WHERE id = :id LIMIT 1");
    $stmt->execute([":id" => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
    }

} elseif ($method === 'PUT') {
    // ✅ Get raw input
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["full_name"], $data["email"], $data["gender"], $data["phone"])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit();
    }

    try {
        $stmt = $connect->prepare("UPDATE crud_users 
            SET full_name = :full_name, email = :email, gender = :gender, phone = :phone 
            WHERE id = :id");

        $stmt->execute([
            ":full_name" => htmlspecialchars(strip_tags($data["full_name"])),
            ":email"     => htmlspecialchars(strip_tags($data["email"])),
            ":gender"    => htmlspecialchars(strip_tags($data["gender"])),
            ":phone"     => htmlspecialchars(strip_tags($data["phone"])),
            ":id"        => $id
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            echo json_encode(["message" => "No changes made"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update user"]);
    }

} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
