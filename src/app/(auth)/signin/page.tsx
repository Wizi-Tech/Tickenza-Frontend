"use client";

import React from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth";
import { AuthService } from "@/services/authService";

type AuthResponse = {
  name: string;
  email: string;
  token: string;
};
const signinSchema = z.object({
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
});
type SigninForm = z.infer<typeof signinSchema>;
export default function SigninPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  });
  const onSubmit = async (data: SigninForm) => {
    try {
      const res = await AuthService.signin(data);
      if (res.status === 200) {
        const user = res.data as AuthResponse;
        localStorage.setItem("token", user.token);
        setUser({
          name: user.name,
          username: user.email,
          token: user.token,
        });
        toast.success("Login Successful");
        router.push("/");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Login failed! Try again.";
      toast.error(errorMessage);
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
        <div className="relative bg-white p-5 rounded-2xl shadow-lg w-full max-w-md z-10">
          <button
            onClick={() => router.push("/")}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg font-bold"
          >
            X
          </button>
          <div className="flex justify-center mb-4 mt-2">
            <img
              src="/Tickenza.png"
              alt="Tickenza Logo"
              className="h-12 w-12 object-contain"
            />
          </div>
          <h2 className="text-lg font-bold text-center mb-1">Welcome Back</h2>
          <p className="text-gray-500 text-center mb-4 text-sm">
            Please login to continue
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="text-black block mb-1 text-m">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
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
            <div>
              <label className="text-black block mb-1 text-s">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                {...register("password")}
                className={`w-full border px-2 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="text-left">
              <Link
                href="/forgot-password"
                className="text-blue-600 text-s hover:underline"
              >
                Forgot Password
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-3 text-s">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
