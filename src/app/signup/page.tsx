"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/services/authService";

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
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[@#$%&*!?^]/, "At least one special character (@, #, $, etc.)")
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 sm:px-6">
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-md z-10 p-5 sm:p-8">
          {/* Close button */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg font-bold"
          >
            ✕
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-3 mt-2">
            <img
              src="/Tickenza.png"
              alt="Tickenza Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
            />
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 text-center mb-5 text-sm sm:text-base">
            Please signup to continue
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            {/* Name */}
            <div>
              <label className="text-black block mb-1 text-sm sm:text-base">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className={`w-full border px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-black block mb-1 text-sm sm:text-base">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                {...register("email")}
                className={`w-full border px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-black block mb-1 text-sm sm:text-base">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                {...register("password")}
                className={`w-full border px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-black block mb-1 text-sm sm:text-base">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                {...register("confirmPassword")}
                className={`w-full border px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="text-black block mb-1 text-sm sm:text-base">
                Role
              </label>
              <select
                {...register("role")}
                defaultValue=""
                className={`w-full border px-3 py-2 rounded-md text-sm sm:text-base focus:outline-none focus:ring-1 ${
                  errors.role
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50 text-sm sm:text-base font-medium"
            >
              {isSubmitting ? "Loading..." : "Signup"}
            </button>
          </form>

          {/* Bottom Link */}
          <p className="text-center text-gray-600 mt-4 text-sm sm:text-base">
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
