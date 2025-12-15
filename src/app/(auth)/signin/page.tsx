"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth";
import { AuthService } from "@/services/authService";
import { Eye, EyeOff } from "lucide-react";

// 🔹 API Response Type
type AuthResponse = {
  name: string;
  email: string;
  role: "Admin" | "User";
  access_token: string;
  token_type: string;
  message: string;
};

// 🔹 Form Validation Schema
const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in)$/i,
      "Invalid email format"
    ),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/[0-9]/, "At least one number")
    .regex(/[@#$%&*!?^]/, "At least one special character")
    .refine((val) => !/\s/.test(val), "Password must not contain spaces"),
});

type SigninForm = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  });

  // 🔹 Submit Handler
  const onSubmit = async (data: SigninForm) => {
    try {
      const res = await AuthService.signin(data);

      if (res.status === 200) {
        const user = res.data as AuthResponse;

        localStorage.setItem("token", user.access_token);

        setUser({
          name: user.name,
          username: user.email,
          token: user.access_token,
          role: user.role,
        });

        toast.success("Login Successful");
        router.push("/");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed! Try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => router.push("/")}
        />

        {/* Card */}
        <div className="relative bg-white p-5 rounded-2xl shadow-lg w-full max-w-md z-10">
          {/* Close Button */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-3 right-3 text-gray-500 hover:text-black font-bold"
          >
            ✕
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/Tickenza.png"
              alt="Tickenza Logo"
              className="h-12 w-12 object-contain"
            />
          </div>

          <h2 className="text-lg font-bold text-center mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center text-sm mb-4">
            Please login to continue
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                {...register("email")}
                className={`w-full border px-2 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password")}
                  className={`w-full border px-2 py-1.5 rounded-md text-sm pr-9 focus:outline-none focus:ring-1 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <Link
                href="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Signup */}
          <p className="text-center text-sm mt-3">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
