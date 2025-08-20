import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const loginUser = (data: { email: string; password: string }) =>
  API.post<{ token: string }>("/auth/login", data);
