import axios from "axios";
// Mine: personally created json file data
import { Admin_URL } from "../../data/BaseURL";

// !! FOR PHP BACKEND API
export const API_BASE = "http://localhost/PHP";

// REGISTER USER
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/register.php`, userData, {
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

// CHECK EMAIL EXISTS
export const loginEmailExists = async (email) => {
  try {
    const res = await axios.get(`${API_BASE}/login.php`, {
      params: { email },
    });
    console.log(res.data);
    return res.data.exists; // true or false from backend
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Email check error"
    );
  }
};

// GET ALL USERS (if needed: for dashboard)
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${API_BASE}/users.php`);
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

// DELETE USER
export const deleteUser = async (userId) => {
  const res = await fetch(`${API_BASE}/delete.php`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error deleting user");
  }

  return data;
};

// !! FOR JSON PLACEHOLDER
// registration form: Post to submit to usersData.json
export const postForm = async (data) => {
  const response = await axios.post(Admin_URL, data);
  return response.data;
};

// ✅ Login form: get to Check if email exists
export const checkEmailExists = async (email) => {
  if (!email) return null;
  const res = await axios.get(`${Admin_URL}?email=${email}`);

  // return true if email exists
  return res.data.length > 0;
};

/* *
 * Fetch admin(s) by email
 * @param {string} email - The email address to search for
 * @returns {Promise<Array>} Array of admins matching the email
 */
export const fetchAdminByEmail = async (email) => {
  if (!email) return [];
  const res = await axios.get(`${Admin_URL}?email=${email}`);
  return res.data;
};
