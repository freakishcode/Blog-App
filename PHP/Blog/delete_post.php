<?php
// ==========================================================
// ✅ Secure Delete Post API (Final Optimized PDO Version)
// ==========================================================

// --- CORS Headers ---
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// --- Handle Preflight ---
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

require_once "./db.php"; // uses $pdo

try {
  // ✅ Ensure DELETE method
  if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    throw new Exception("Invalid request method");
  }

  // ✅ Decode JSON input
  $data = json_decode(file_get_contents("php://input"), true);
  if (empty($data["id"]) || !is_numeric($data["id"])) {
    throw new Exception("Invalid or missing post ID");
  }

  $id = (int) $data["id"];

  // ✅ Step 1: Get image filename
  $stmt = $pdo->prepare("SELECT image_url FROM posts WHERE id = :id LIMIT 1");
  $stmt->execute(["id" => $id]);
  $post = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$post) {
    throw new Exception("Post not found");
  }

  // ✅ Step 2: Delete DB record
  $deleteStmt = $pdo->prepare("DELETE FROM posts WHERE id = :id");
  $deleteStmt->execute(["id" => $id]);

  // ✅ Step 3: Delete image from uploads folder
  if (!empty($post["image_url"])) {
    $imagePath = __DIR__ . "/uploads/" . basename($post["image_url"]);
    if (file_exists($imagePath)) {
      unlink($imagePath);
    }
  }

  // ✅ Step 4: Return success
  echo json_encode([
    "success" => true,
    "message" => "🗑️ Post deleted successfully"
  ]);

} catch (Exception $e) {
  http_response_code(400);
  echo json_encode([
    "error" => $e->getMessage()
  ]);
}
