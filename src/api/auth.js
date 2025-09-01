// api/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000"; // your backend API

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data; // { token, user }
};

export const registerUser = async (newUser) => {
  const response = await axios.post(`${API_URL}/register`, newUser);
  return response.data; // { token, user }
};

export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
