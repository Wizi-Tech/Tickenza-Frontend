import axios from "axios";

const API = axios.create({
  baseURL: "https://tickenza-app.onrender.com", 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;
