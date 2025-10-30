<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "./db.php";

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
  $data = json_decode(file_get_contents("php://input"), true);
  $id = intval($data["id"]);

  // ✅ First, get image file name to delete from uploads folder
  $getImage = $conn->query("SELECT image FROM posts WHERE id = $id");
  if ($getImage && $getImage->num_rows > 0) {
    $img = $getImage->fetch_assoc()["image"];
    $imagePath = "uploads/" . $img;

    // ✅ Delete post record
    $sql = "DELETE FROM posts WHERE id = $id";
    if ($conn->query($sql)) {
      if (file_exists($imagePath)) {
        unlink($imagePath); // remove image
      }
      echo json_encode(["success" => true, "message" => "Post deleted successfully"]);
    } else {
      echo json_encode(["error" => "Failed to delete post"]);
    }
  } else {
    echo json_encode(["error" => "Post not found"]);
  }
} else {
  echo json_encode(["error" => "Invalid request method"]);
}

$conn->close();
?>
