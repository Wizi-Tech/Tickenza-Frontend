"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { AuthService } from "@/services/authService"; 
type AuthResponse = {
  name: string;
  username: string;
  token: string;
};

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await AuthService.signin({ username, password });

      if (res.status === 200) {
         const data = res.data as AuthResponse;

        setUser({
          name: data.name,
          username: data.username,
          token: data.token,
        });

        toast.success("Login Successful!");
        router.push("/");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err: any) {
      console.error("Error logging in:", err);
      const errorMessage =
        err.response?.data?.message || "Server Error! Please try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => router.push("/")}
        ></div>

        <div className="relative bg-white p-6 rounded-xl shadow-lg w-96 z-10">
          <button
            onClick={() => router.push("/")}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg font-bold"
          >
            X
          </button>

          <div className="flex justify-center mb-4">
            <img
              src="/Tickenza.png"
              alt="Tickenza Logo"
              className="h-16 w-16 object-contain"
            />
          </div>

          <h2 className="text-xl font-bold mb-2 text-center">
            Welcome to Tickenza
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Please login to continue
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="text-black block mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-3">
              <label className="text-black block mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white w-full py-2 rounded disabled:opacity-70 hover:bg-blue-600 transition"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <p className="text-black text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-500 underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
