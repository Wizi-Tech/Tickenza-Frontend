import axios from "axios";

const API = axios.create({
  baseURL: "https://tickenza-backend-production.up.railway.app",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!config.headers) config.headers = {};

  // ✅ Important fix: don't set Content-Type manually for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; // Axios handles multipart automatically
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;
