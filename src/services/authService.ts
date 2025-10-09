import API from "./api";

export const AuthService = {
  // Login using form-urlencoded
  signin: (data: { username: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    return API.post("/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  // Signup uses JSON
  signup: (data: { name: string; username: string; password: string }) => {
    return API.post("/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
