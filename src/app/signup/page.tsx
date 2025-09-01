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

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" }); 
    }
  };

  const validateSignup = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Z][a-zA-Z]*$/.test(formData.name)) {
      newErrors.name =
        "Invalid name (First letter capital & only alphabets allowed)";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[A-Za-z0-9!@#$%^&*]{8,}$/.test(formData.username)) {
      newErrors.username =
        "Invalid username (Minimum 8 characters. Alphabets, numbers, special chars allowed)";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Invalid password (At least 6 chars, 1 uppercase, 1 number, 1 special character)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignup()) return;

    setLoading(true);
    try {
      const res = await AuthService.signup({
        name: formData.name,
        username: formData.username,
        password: formData.password,
      });

      if (res.status === 200) {
        const data = res.data as AuthResponse;
        toast.success("Signup Successful!");
        router.push("/signin");
      }
    } catch (err: any) {
      console.error("Error signing up:", err);
      const errorMessage =
        err.response?.data?.message || "Signup failed! Try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
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

          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-gray-500 text-center mb-6">
            Please signup to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-black block mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="text-black block mb-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="text-black block mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Signup"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
