// TODO: Using AXIOS LIBRARY
import axios from "axios";

// Mine: personally created json file data
import { BASE_URL } from "../../data/BaseURL";

// Create
export const createPost = async (newUser) => {
  const response = await axios.post(BASE_URL, newUser);
  return response.data;
};

// Read
export const fetchUsers = async () => {
  const res = await axios.get(BASE_URL);
  return res.data; // return users list
};

// update

// Fetch single user by ID
export const fetchUserById = async (id) => {
  const res = await axios.get(`${BASE_URL}${id}`);
  return res.data;
};

// Update user by ID
export const updateUserById = async (id, updatedData) => {
  const res = await axios.put(`${BASE_URL}${id}`, updatedData);
  return res.data;
};

// !! FOR PHP BACKEND API
export const API_BASE = "http://localhost/PHP";

// CREATE USER
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/create.php`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Registration failed");
    }
    return res.data; // contains token & user info
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Registration error"
    );
  }
};

// READ USERS
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${API_BASE}/read.php`);
    // If your PHP returns { success: true, data: [...] }
    if (res.data.success) {
      console.log("Fetched users data:", res.data);
    } else if (Array.isArray(res.data)) {
      console.log(res.data);
    } else {
      console.log("Unexpected response format");
    }

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch users"
    );
  }
};

// UPDATE USER
export const updateUser = async (userId, updatedData) => {
  try {
    const res = await axios.put(`${API_BASE}/update.php`, {
      id: userId,
      ...updatedData,
    });

    return res.data; // axios automatically parses JSON
  } catch (error) {
    // Standardize error handling
    const message =
      error.response?.data?.message || error.message || "Error updating user";
    throw new Error(message);
  }
};

// DELETE USER
export const deleteUser = async (userId) => {
  try {
    const res = await axios.delete(`${API_BASE}/delete.php`, {
      data: { id: userId }, // axios requires `data` key for body in DELETE
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Error deleting user";
    throw new Error(message);
  }
};
