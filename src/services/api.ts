import axios from "axios";

const API = axios.create({
  baseURL: "https://tickenza-backend-production.up.railway.app",
});

// 🧩 Interceptor to attach token + handle headers correctly
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!config.headers) {
    config.headers = {};
  }

  // ✅ Set Content-Type only for non-FormData requests
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  // ✅ Add token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🧩 Handle API errors gracefully
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;