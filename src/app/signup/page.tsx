"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/services/authService";
import { Eye, EyeOff } from "lucide-react";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed")
      .regex(/^[A-Z]/, "First letter must be capital"),
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
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    role: z.enum(["user", "admin"], { message: "Role is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      const res = await AuthService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (res.status === 200) {
        toast.success("Signup Successful!");
        router.push("/signin");
      }
    } catch (err: any) {
      let errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed! Try again.";

      if (err.response?.status === 409) {
        errorMessage = "User already exists!";
      }

      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-4">
          <button
            onClick={() => router.push("/")}
            className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold"
          >
            ✕
          </button>

          <div className="flex justify-center mb-2">
            <img src="/Tickenza.png" alt="Logo" className="h-10 w-10" />
          </div>

          <h2 className="text-lg font-bold text-center">Create Account</h2>
          <p className="text-gray-500 text-center text-sm mb-3">
            Please signup to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Name */}
            <Input
              label="Name"
              placeholder="Enter your name"
              register={register("name")}
              error={errors.name?.message}
            />

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="Enter email"
              register={register("email")}
              error={errors.email?.message}
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              register={register("password")}
              error={errors.password?.message}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            {/* Role */}
            <div>
              <label className="text-sm">Role</label>
              <select
                {...register("role")}
                defaultValue=""
                className="w-full border px-2 py-1 rounded-md text-sm"
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs">{errors.role.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Loading..." : "Signup"}
            </button>
          </form>

          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

/* ---------- Reusable Inputs ---------- */

function Input({ label, register, error, ...props }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        {...register}
        {...props}
        className="w-full border px-2 py-1 rounded-md text-sm"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function PasswordInput({ label, show, toggle, register, error }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register}
          className="w-full border px-2 py-1 rounded-md text-sm pr-8"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-1.5 text-gray-500"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
