<?php
include "./db.php";

// Get post ID from query parameter
$id = (int)$_GET['id'];
$sql = "DELETE FROM posts WHERE id=$id";

// Execute deletion
if ($conn->query($sql)) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["error" => $conn->error]);
}
?>
