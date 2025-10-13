import API from "./api";

export const AuthService = {
  signin: (data: { email: string; password: string }) => {
    return API.post("/signin",
      {
        email: data.email,
        password: data.password,
      },
      {
        headers: { "Content-Type": "application/json", },
      }
    );
  },

  signup: (data: { name: string; email: string; password: string; role: "user" | "admin" }) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirm_password: data.password,
      role: data.role === "admin" ? "Admin" : "User",
    };
    return API.post("/register", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
