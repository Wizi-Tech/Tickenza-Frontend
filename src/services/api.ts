import axios from "axios";

// ---------- Create Axios instance ----------
const API = axios.create({
  baseURL: "https://tickenza-backend.onrender.com",
  withCredentials: true, // include cookies if backend uses them
});

// ---------- Request interceptor ----------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get token from localStorage
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`; // attach token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---------- Response interceptor ----------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
