"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/services/authService";

type AuthResponse = {
  name: string;
  email: string;
  token: string;
};

const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .refine((val) => /^[A-Za-z\s]+$/.test(val), {
        message: "Only alphabets allowed",
      })
      .refine((val) => /^[A-Z]/.test(val), {
        message: "First letter must be capital",
      }),
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in)$/i, "Invalid email format"),
    password: z
      .string()
      .min(5, "Password must be at least 5 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@#$%&*!?^]/,
        "Password must contain at least one special character (@, #, $, %, &, *, !, ?)"
      )
      .refine((val) => !/\s/.test(val), "Password must not contain spaces"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    role: z.enum(["user", "admin"] as const, { message: "Role is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupForm) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      const res = await AuthService.signup(payload);

      if (res.status === 200) {
        toast.success("Signup Successful!");
        router.push("/signin");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Signup failed! Try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-4 md:px-0">
        <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg z-10 p-6 sm:p-8 overflow-y-auto max-h-[95vh]">
          {/* Close Button */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
          >
            ×
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-3 mt-1">
            <img
              src="/Tickenza.png"
              alt="Tickenza Logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-1 text-gray-900">
            Create Account
          </h2>
          <p className="text-gray-500 text-center mb-5 text-sm">
            Please signup to continue
          </p>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-black block mb-1 text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className={`w-full border-[1.5px] px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-black block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                {...register("email")}
                className={`w-full border-[1.5px] px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-black block mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                {...register("password")}
                className={`w-full border-[1.5px] px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-black block mb-1 text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                {...register("confirmPassword")}
                className={`w-full border-[1.5px] px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="text-black block mb-1 text-sm font-medium">
                Role
              </label>
              <select
                {...register("role")}
                defaultValue=""
                className={`w-full border-[1.5px] px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 focus:outline-none focus:ring-2 ${
                  errors.role
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-[14px] font-semibold shadow-sm"
            >
              {isSubmitting ? "Loading..." : "Signup"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-4 text-[13px]">
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
