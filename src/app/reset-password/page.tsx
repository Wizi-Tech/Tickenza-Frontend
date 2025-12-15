"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await AuthService.verifyOtpAndResetPassword({
        email,
        otp,
        new_password: data.password,
      });

      toast.success("Password reset successful");
      router.push("/signin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-bold text-center">Reset Password</h2>

      <input
        {...register("password")}
        type="password"
        placeholder="New Password"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        {...register("confirmPassword")}
        type="password"
        placeholder="Confirm Password"
        className="w-full border px-3 py-2 rounded"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Reset Password
      </button>
    </form>
  );
}
