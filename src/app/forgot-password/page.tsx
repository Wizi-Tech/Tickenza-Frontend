"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";

type FormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await AuthService.forgotPassword(data.email);
      toast.success("OTP sent to your email");
      router.push(`/verify-otp?email=${data.email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto mt-20 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Forgot Password</h2>

        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white flex items-center justify-center
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"}`}
        >
          {loading ? "Loading..." : "Send OTP"}
        </button>
      </form>
    </>
  );
}
