import API from "./api";

export const AuthService = {
  signin: (data: { email: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append("email", data.email); 
    formData.append("password", data.password);
    return API.post("/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },
  signup: (data: { name: string; email: string; password: string; role: "user" | "admin" }) => {
    return API.post("/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
