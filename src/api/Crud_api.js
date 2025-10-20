// TODO: Using AXIOS LIBRARY
import axios from "axios";

// TODO: personally created json file data
// import { BASE_URL, Admin_URL } from "../../data/BaseURL";

// TODO: PHP BACKEND DATABASE
import { PHP_BASE_URL } from "../../data/BaseURL";

// TODO: FIREBASE DATABASE
import { FIREBASE_URL } from "../../data/BaseURL";

// !! FOR JSON PLACEHOLDER OR FIREBASE DATABASE
// Create
export const createPost = async (newUser) => {
  const response = await axios.post(FIREBASE_URL, newUser);
  return response.data;
};

// Read
export const fetchUsers = async () => {
  const res = await axios.get(FIREBASE_URL);
  return res.data; // return users list
};

// update

// Fetch single user by ID
export const fetchUserById = async (id) => {
  const res = await axios.get(`${FIREBASE_URL}${id}`);
  return res.data;
};

// Update user by ID
export const updateUserById = async (id, updatedData) => {
  const res = await axios.put(`${FIREBASE_URL}${id}`, updatedData);
  return res.data;
};

// !! FOR PHP BACKEND API
// CREATE USER
export const createUser = async (userData) => {
  try {
    const res = await axios.post(`${PHP_BASE_URL}/create.php`, userData, {
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
export const ReadUsers = async () => {
  try {
    const res = await axios.get(`${PHP_BASE_URL}/read.php`);
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
    const res = await axios.put(`${PHP_BASE_URL}/update.php`, {
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
    const res = await axios.delete(`${PHP_BASE_URL}/delete.php`, {
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
