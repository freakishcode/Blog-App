<?php
include "./db.php";

// Fetch all posts from the database
$result = $conn->query("SELECT * FROM posts ORDER BY created_at DESC");
$posts = [];

// Collect posts into an array
while ($row = $result->fetch_assoc()) {
  $posts[] = $row;
}

// Return posts as JSON
echo json_encode($posts);
?>
