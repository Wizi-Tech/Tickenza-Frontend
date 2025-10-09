import API from "./api";

export const AuthService = {
  signin: (data: { username: string; password: string }) => {
    return API.post("/login", JSON.stringify({
      username: data.username,
      password: data.password,
    }), {
      headers: {
        "Content-Type": "application/x--www-form-urlencoded", 
      },
    });
  },

  signup: (data: { name: string; username: string; password: string }) => {
    return API.post("/signup", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
