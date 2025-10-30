<?php
include "./db.php";


// Directory for uploads
$uploadDir = "uploads/";
if (!file_exists($uploadDir)) {
  mkdir($uploadDir, 0777, true);
}

// Validate input fields
if (empty($_POST['title']) || empty($_POST['content']) || empty($_POST['author'])) {
  echo json_encode(["error" => "Missing required fields"]);
  exit;
}

// Sanitize inputs
$title = $conn->real_escape_string($_POST['title']);
$content = $conn->real_escape_string($_POST['content']);
$author = $conn->real_escape_string($_POST['author']);
$imageUrl = null;

// Handle image upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
  $fileTmpPath = $_FILES['image']['tmp_name'];
  $fileName = time() . "_" . preg_replace("/[^A-Za-z0-9._-]/", "_", $_FILES['image']['name']);
  $fileType = mime_content_type($fileTmpPath);

  // Allow only valid image types
  $allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!in_array($fileType, $allowedTypes)) {
    echo json_encode(["error" => "Invalid image type"]);
    exit;
  }

  // Move the uploaded file to the uploads folder
  $targetPath = $uploadDir . $fileName;
  if (move_uploaded_file($fileTmpPath, $targetPath)) {
    $imageUrl = $targetPath;
  } else {
    echo json_encode(["error" => "Failed to upload image"]);
    exit;
  }
} else {
  echo json_encode(["error" => "No image uploaded or upload error"]);
  exit;
}

// Insert into database
$sql = "INSERT INTO posts (title, content, author, image_url, created_at)
        VALUES ('$title', '$content', '$author', '$imageUrl', NOW())";

if ($conn->query($sql)) {
  echo json_encode([
    "success" => true,
    "message" => "Post created successfully",
    "post" => [
      "title" => $title,
      "content" => $content,
      "author" => $author,
      "image_url" => $imageUrl,
    ],
  ]);
} else {
  echo json_encode(["error" => $conn->error]);
}
?>
