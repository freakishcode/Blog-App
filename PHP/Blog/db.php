<?php
// ============================================================
// ✅ Database Connection (PDO Version)
// ============================================================

// Database credentials
$host = "localhost";
$dbname = "blog_db";
$user = "myadmin";
$pass = "Bakare291";

// Data Source Name
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

try {
  // ✅ Create PDO instance
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,       // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,  // Fetch as associative arrays
    PDO::ATTR_EMULATE_PREPARES => false,               // Use real prepared statements
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4" // Ensure UTF-8 support
  ]);

  // Optional: Uncomment if you want to confirm connection (for debugging)
  // echo json_encode(["success" => "Database connected successfully"]);

} catch (PDOException $e) {
  // Return JSON error message if connection fails
  http_response_code(500);
  echo json_encode([
    "error" => "Database connection failed",
    "details" => $e->getMessage()
  ]);
  exit;
}
?>
