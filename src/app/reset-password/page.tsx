"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthService } from "@/services/authService";

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const { register, handleSubmit } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await AuthService.verifyOtpAndResetPassword({
        email,
        otp,
        new_password: data.password,
      });

      toast.success("Password reset successful");
      router.push("/signin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto mt-20 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Reset Password</h2>

        <input
          {...register("password")}
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white flex items-center justify-center
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"}`}
        >
          {loading ? "Loading..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}
