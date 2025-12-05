import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost/PHP/Blog";

const api = axios.create({
  baseURL,
  withCredentials: false, // set true if you rely on cookies
  headers: {
    Accept: "application/json",
  },
});

// Optional: interceptors for central error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // keep errors for components to handle, but normalize format
    return Promise.reject(err);
  }
);

export default api;
