<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "./db.php"; // uses $pdo

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

$uploadDir = "uploads/";
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

try {
    // ✅ Support both JSON & multipart/form-data
    if (!empty($_POST)) {
        $id = intval($_POST["id"] ?? 0);
        $title = trim($_POST["title"] ?? "");
        $content = trim($_POST["content"] ?? "");
        $author = trim($_POST["author"] ?? "");
    } else {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = intval($data["id"] ?? 0);
        $title = trim($data["title"] ?? "");
        $content = trim($data["content"] ?? "");
        $author = trim($data["author"] ?? "");
    }

    if (!$id || !$title || !$content) {
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    // ✅ Fetch old image
    $stmt = $pdo->prepare("SELECT image FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch();

    if (!$post) {
        echo json_encode(["error" => "Post not found"]);
        exit;
    }

    $oldImage = $post["image"];
    $newImage = $oldImage;

    // ✅ If new image uploaded
    if (!empty($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
        $fileName = time() . "_" . basename($_FILES["image"]["name"]);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetPath)) {
            if (!empty($oldImage) && file_exists($uploadDir . $oldImage)) {
                unlink($uploadDir . $oldImage);
            }
            $newImage = $fileName;
        }
    }

    // ✅ Update query (safe prepared statement)
    $stmt = $pdo->prepare("
        UPDATE posts
        SET title = ?, content = ?, author = ?, image_url = ?
        WHERE id = ?
    ");
    $stmt->execute([$title, $content, $author, $newImage, $id]);

    echo json_encode(["success" => true, "message" => "✅ Post updated successfully"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "❌ Update failed",
        "details" => $e->getMessage()
    ]);
}
