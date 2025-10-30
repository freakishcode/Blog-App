<?php
// Include database connection
include "./db.php";

// Fetch all blog posts
$sql = "SELECT * FROM posts ORDER BY created_at DESC";
$result = $conn->query($sql);

// Fetch all posts
$posts = [];
if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $posts[] = $row;
  }
}

// Return posts as JSON
echo json_encode($posts);
$conn->close();
?>
