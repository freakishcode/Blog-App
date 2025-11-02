<?php
// ---------- HEADERS & CORS (restrict in production) ----------
header("Content-Type: application/json; charset=UTF-8");

// Allowed origins - replace or move to env in production
$allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-production-domain.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: {$origin}");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Short-circuit OPTIONS preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

// Only allow POST for creating resources
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["success" => false, "error" => "Method not allowed"]);
  exit;
}

include "./db.php"; // expects $pdo (PDO) configured

// Ensure upload dir exists and is secure
$uploadDir = __DIR__ . "/uploads/";
if (!is_dir($uploadDir)) {
  if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Unable to create upload directory"]);
    exit;
  }
}
// Prevent execution of uploaded files via .htaccess (Apache). Create if missing.
$htaccess = $uploadDir . ".htaccess";
if (!file_exists($htaccess)) {
  @file_put_contents($htaccess, "Options -Indexes\n<FilesMatch \"\.(php|phtml|php3|php4|php5|phar)$\">\n  Deny from all\n</FilesMatch>\n");
}

try {
  // Read form-data or JSON
  if (!empty($_POST)) {
    $title = trim((string)($_POST["title"] ?? ""));
    $content = trim((string)($_POST["content"] ?? ""));
    $author = trim((string)($_POST["author"] ?? ""));
  } else {
    $data = json_decode(file_get_contents("php://input"), true) ?? [];
    $title = trim((string)($data["title"] ?? ""));
    $content = trim((string)($data["content"] ?? ""));
    $author = trim((string)($data["author"] ?? ""));
  }

  // Basic validation
  $errors = [];
  if ($title === '') $errors[] = "Title is required";
  if ($content === '') $errors[] = "Content is required";
  if ($author === '') $errors[] = "Author is required";

  if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
  }

  // default image
  $imageFile = null;

  // File upload handling (if provided)
  if (isset($_FILES["image_url"])) {
    $file = $_FILES["image_url"];
    if ($file["error"] !== UPLOAD_ERR_NO_FILE) {
      if ($file["error"] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "File upload error"]);
        exit;
      }

      // max 10MB
      $maxSize = 10 * 1024 * 1024;
      if (!isset($file["size"]) || $file["size"] > $maxSize) {
        http_response_code(413);
        echo json_encode(["success" => false, "error" => "Image exceeds maximum allowed size of 10MB"]);
        exit;
      }

      // Strong mime/type detection
      $finfo = new finfo(FILEINFO_MIME_TYPE);
      $mime  = $finfo->file($file["tmp_name"]) ?: '';
      $allowed = [
        "image/jpeg" => "jpg",
        "image/png"  => "png",
        "image/gif"  => "gif",
        "image/webp" => "webp",
      ];

      if (!array_key_exists($mime, $allowed)) {
        http_response_code(415);
        echo json_encode(["success" => false, "error" => "Invalid image type"]);
        exit;
      }

      // Safe filename
      $ext = $allowed[$mime];
      try {
        $random = bin2hex(random_bytes(12));
      } catch (Exception $e) {
        $random = time() . bin2hex(openssl_random_pseudo_bytes(8));
      }
      $fileName = $random . "." . $ext;
      $target = $uploadDir . $fileName;

      // Move uploaded file
      if (!move_uploaded_file($file["tmp_name"], $target)) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to move uploaded file"]);
        exit;
      }

      // Set safe permissions
      @chmod($target, 0644);
      $imageFile = $fileName;
    }
  }

  // Insert post (use prepared statement)
  $stmt = $pdo->prepare("
    INSERT INTO posts (title, content, author, image_url, created_at)
    VALUES (:title, :content, :author, :image_url, NOW())
  ");

  $stmt->execute([
    ":title"     => $title, // keep raw; escape on output. alternative: store sanitized version
    ":content"   => $content,
    ":author"    => $author,
    ":image_url" => $imageFile,
  ]);

  $postId = (int)$pdo->lastInsertId();

  // Response (do not leak DB internals)
  http_response_code(201);
  echo json_encode([
    "success" => true,
    "message" => "Post created successfully",
    "post" => [
      "id" => $postId,
      "title" => $title,
      "content" => $content,
      "author" => $author,
      "image_url" => $imageFile,
      "created_at" => date("Y-m-d H:i:s"),
    ]
  ]);
  exit;

} catch (Throwable $e) {
  // Log internal error for admins; do NOT leak to client
  error_log("create_post.php error: " . $e->getMessage());
  http_response_code(500);
  echo json_encode(["success" => false, "error" => "Internal server error"]);
  exit;
}
