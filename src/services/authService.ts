import API from "./api";
export type AuthResponse = {
  name: string;
  email: string;
  role: "Admin" | "User";
  access_token: string;
  token_type: string;
  message: string;
};

export const AuthService = {
  signin: (data: { email: string; password: string }) => {
    return API.post<AuthResponse>("/signin", data, {
      headers: { "Content-Type": "application/json" },
    });
  },
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  }) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirm_password: data.password,
      role: data.role === "admin" ? "Admin" : "User",
    };

    return API.post("/register", payload, {
      headers: { "Content-Type": "application/json" },
    });
  },
  forgotPassword: (email: string) => {
    return API.post(
      "/auth/forgot-password",
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
  },
  verifyOtpAndResetPassword: (data: {
    email: string | null;
    otp: string | null;
    new_password: string;
  }) => {
    return API.post(
      "/auth/verify-otp",
      data,
      { headers: { "Content-Type": "application/json" } }
    );
  },
};
