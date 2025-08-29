import API from "./api";

type SigninPayload = { username: string; password: string };
type SignupPayload = { name: string; username: string; password: string };

export const AuthService = {
  signin: (payload: SigninPayload) => API.post("/login", payload), 
  signup: (payload: SignupPayload) => API.post("/signup", payload),
};
