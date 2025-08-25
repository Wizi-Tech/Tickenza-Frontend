import axios from "axios";

const API = axios.create({
  baseURL: "https://tickenza-app.onrender.com",
});

export const loginUser = (data: { email: string; password: string }) =>
  API.post<{ token: string }>("/auth/login", data);
