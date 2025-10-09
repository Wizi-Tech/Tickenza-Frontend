import API from "./api";

export const AuthService = {
  signin: (data: { username: string; password: string }) => {
    return API.post(
      "/login",
      {
        username: data.username,
        password: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  signup: (data: { name: string; username: string; password: string }) => {
    return API.post("/signup", data);
  },
};
