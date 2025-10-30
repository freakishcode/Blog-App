<?php
include "./db.php";

// Get updated post data from request body
$data = json_decode(file_get_contents("php://input"), true);

// Prepare and execute update query
$id = (int)$data['id'];
$title = $conn->real_escape_string($data['title']);
$content = $conn->real_escape_string($data['content']);
$author = $conn->real_escape_string($data['author']);

// Update post in the database
$sql = "UPDATE posts SET title='$title', content='$content', author='$author' WHERE id=$id";

// Execute update
if ($conn->query($sql)) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["error" => $conn->error]);
}
?>
