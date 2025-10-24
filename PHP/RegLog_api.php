<?php
// ===========================================================
// 🔐 Secure Register + Login + Email Verification + Auto-Login
// Author: Olayemi (optimized by GPT-5)
// Version: 4.0 | InfinityFree-safe | JSON API
// ===========================================================

declare(strict_types=1);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
date_default_timezone_set('UTC');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

// ---- CONFIG ----
$DB_HOST = 'sqlXXX.infinityfree.com';
$DB_USER = 'epiz_XXXXX';
$DB_PASS = 'YOUR_DB_PASSWORD';
$DB_NAME = 'epiz_XXXXX_userdb';

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// ---- UTIL ----
function respond($success, $message, $extra = [])
{
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

function sendVerificationEmail($email, $token)
{
    $verifyLink = "https://bkapicalls.infinityfreeapp.com/php/verifyEmail.php?token=$token";
    $subject = "Verify your email address";
    $body = "Click the link below to verify your account:\n\n$verifyLink\n\nThis link will expire in 24 hours.";

    // InfinityFree doesn’t support mail() by default — you can integrate SMTP if needed
    @mail($email, $subject, $body, "From: noreply@yourdomain.com");
}

// ---- INPUT ----
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['mode'])) respond(false, 'Invalid request payload.');

$mode = $conn->real_escape_string($data['mode']);
$username = $conn->real_escape_string(trim($data['username'] ?? ''));
$email = $conn->real_escape_string(trim($data['email'] ?? ''));
$password = $conn->real_escape_string(trim($data['password'] ?? ''));
$token = $conn->real_escape_string(trim($data['token'] ?? ''));

// ---- REGISTER ----
if ($mode === 'register') {
    if (empty($username) || empty($email) || empty($password)) {
        respond(false, 'All fields are required for registration.');
    }

    // Check existing user
    $check = $conn->prepare("SELECT id FROM users WHERE username=? OR email=?");
    $check->bind_param("ss", $username, $email);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) respond(false, 'Username or email already exists.');
    $check->close();

    // Generate verification token
    $verifyToken = bin2hex(random_bytes(16));
    $verifyExpires = date('Y-m-d H:i:s', time() + 86400); // 24 hours

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $insert = $conn->prepare("INSERT INTO users (username, email, password, verify_token, verify_expires) VALUES (?, ?, ?, ?, ?)");
    $insert->bind_param("sssss", $username, $email, $hashedPassword, $verifyToken, $verifyExpires);

    if ($insert->execute()) {
        sendVerificationEmail($email, $verifyToken);
        respond(true, 'Registration successful! Please check your email to verify your account.');
    } else {
        respond(false, 'Registration failed.');
    }
}

// ---- VERIFY EMAIL ----
if ($mode === 'verify') {
    if (empty($token)) respond(false, 'Missing verification token.');

    $stmt = $conn->prepare("SELECT id, verify_expires FROM users WHERE verify_token=? AND verified=0 LIMIT 1");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) respond(false, 'Invalid or expired token.');

    $user = $result->fetch_assoc();
    if (strtotime($user['verify_expires']) < time()) {
        respond(false, 'Verification link expired.');
    }

    $update = $conn->prepare("UPDATE users SET verified=1, verify_token=NULL WHERE id=?");
    $update->bind_param("i", $user['id']);
    $update->execute();

    respond(true, 'Email verified successfully. You can now log in.');
}

// ---- LOGIN ----
if ($mode === 'login') {
    if (empty($username) || empty($password)) {
        respond(false, 'Username and password required.');
    }

    $query = $conn->prepare("SELECT id, username, password, verified FROM users WHERE username=? LIMIT 1");
    $query->bind_param("s", $username);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows === 0) respond(false, 'User not found.');
    $user = $result->fetch_assoc();

    if (!$user['verified']) respond(false, 'Please verify your email before logging in.');
    if (!password_verify($password, $user['password'])) respond(false, 'Invalid password.');

    // Generate new session token for auto-login
    $sessionToken = bin2hex(random_bytes(20));
    $expires = date('Y-m-d H:i:s', time() + 86400 * 7); // 7 days

    $saveToken = $conn->prepare("UPDATE users SET session_token=?, session_expires=? WHERE id=?");
    $saveToken->bind_param("ssi", $sessionToken, $expires, $user['id']);
    $saveToken->execute();

    respond(true, 'Login successful.', [
        'username' => $user['username'],
        'token' => $sessionToken,
    ]);
}

// ---- AUTO LOGIN ----
if ($mode === 'auto-login') {
    if (empty($token)) respond(false, 'Missing token.');

    $stmt = $conn->prepare("SELECT username FROM users WHERE session_token=? AND session_expires > NOW() LIMIT 1");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) respond(false, 'Session expired or invalid.');
    $user = $result->fetch_assoc();

    respond(true, 'Auto-login successful.', ['username' => $user['username']]);
}

respond(false, 'Invalid mode.');
