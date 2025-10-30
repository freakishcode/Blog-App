backend/
│
├── db.php
├── create_post.php
├── get_posts.php
├── update_post.php
├── delete_post.php
└── .htaccess (optional for CORS)

CREATE DATABASE blog_db;
USE blog_db;

CREATE TABLE posts (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
content TEXT NOT NULL,
author VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## Frontend (React + Tailwind + TanStack Query)

⚙️ Install Dependencies
npm create vite@latest blog-frontend --template react
cd blog-frontend
npm install @tanstack/react-query axios react-hook-form yup @hookform/resolvers
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

src/
├── api/
│ └── blogApi.js
├── components/
│ ├── BlogForm.jsx
│ └── Dashboard.jsx
├── App.jsx
└── main.jsx
