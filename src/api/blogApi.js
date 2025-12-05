import axios from "axios";
import api from "./axios";

// Base URL for the backend API
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost/PHP/Blog";

// Fetch all blog posts
export const fetchPosts = async () => {
  const res = await axios.get(`${BASE_URL}/get_posts.php`);
  return res.data;
};

/**
 * createPost - sends formData including an optional image file
 * returns axios response promise
 */
export const createPostTest = (formData, onUploadProgress) => {
  return api.post("/create_post.php", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};

/**
 * Create a new blog post
 * @param {FormData} formData - Blog form data (title, content, author, image)
 * @param {Function} setUploadProgress - React state setter for upload progress
 * @returns {Promise<Object>} - Response data from server
 */

export const createPost = async (formData, setUploadProgress) => {
  const res = await axios.post(`${BASE_URL}/create_post.php`, formData, {
    headers: { "Content-Type": "multipart/form-data" },

    //
    onUploadProgress: (event) => {
      const percent = Math.round((event.loaded * 100) / event.total);

      // Update upload progress state
      if (setUploadProgress) setUploadProgress(percent);
    },
  });
  return res.data;
};

// Update an existing blog post
export const updatePost = async (formData) => {
  const res = await axios.post(`${BASE_URL}/update_post.php`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete a blog post
// export const deletePost = async (id) => {
//   const res = await axios.delete(`${BASE_URL}/delete_post.php?id=${id}`);
//   return res.data;
// };

export const deletePost = async (id) => {
  await axios.delete(`${BASE_URL}/delete_post.php`, {
    data: { id },
    headers: { "Content-Type": "application/json" },
  });
};
