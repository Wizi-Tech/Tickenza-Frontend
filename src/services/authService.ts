import API from "./api";

export const AuthService = {
  signin: (data: { username: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);
    return API.post("/login", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  signup: (data: { name: string; username: string; password: string }) => {
    return API.post("/signup", data); 
  },
};
