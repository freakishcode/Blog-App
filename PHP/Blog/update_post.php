<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "./db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $uploadDir = "uploads/";
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

    // Handle both form-data and JSON
    if (!empty($_POST)) {
        $id = intval($_POST["id"]);
        $title = $conn->real_escape_string($_POST["title"]);
        $content = $conn->real_escape_string($_POST["content"]);
        $author = $conn->real_escape_string($_POST["author"]);
    } else {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = intval($data["id"]);
        $title = $conn->real_escape_string($data["title"]);
        $content = $conn->real_escape_string($data["content"]);
        $author = $conn->real_escape_string($data["author"]);
    }

    // Get existing post to preserve old image
    $getOld = $conn->query("SELECT image FROM posts WHERE id = $id");
    if (!$getOld || $getOld->num_rows === 0) {
        echo json_encode(["error" => "Post not found"]);
        exit;
    }

    $oldImage = $getOld->fetch_assoc()["image"];
    $newImage = $oldImage; // default: keep old image

    // If new image uploaded
    if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
        $fileName = time() . "_" . basename($_FILES["image"]["name"]);
        $targetPath = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetPath)) {
            // Delete old image
            if (!empty($oldImage) && file_exists($uploadDir . $oldImage)) {
                unlink($uploadDir . $oldImage);
            }
            $newImage = $fileName;
        }
    }

    // Update query
    $sql = "UPDATE posts 
            SET title='$title', content='$content', author='$author', image='$newImage'
            WHERE id=$id";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "✅ Post updated successfully"]);
    } else {
        echo json_encode(["error" => "❌ Update failed: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
