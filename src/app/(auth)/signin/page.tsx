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
  username: string;
  token: string;
};
const signinSchema = z.object({
  username: z
    .string()
    .min(8, "Username must be at least 8 characters")
    .regex(/^[A-Za-z0-9!@#$%^&*]+$/, "Invalid characters in username"),
    password: z.string().min(8, "Password must be at least 8 characters"),
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
        setUser({
          name: user.name,
          username: user.username,
          token: user.token,
        });

        toast.success("Login Successful");
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
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

          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome to Tickenza
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Please login to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-black block mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                {...register("username")}
                className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-black block mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                {...register("password")}
                className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-green-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Loading..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 text-sm">
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
