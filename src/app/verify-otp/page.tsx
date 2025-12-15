"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type FormData = {
  otp: string;
};

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const { register, handleSubmit } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: FormData) => {
    if (!data.otp || data.otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      router.push(`/reset-password?email=${email}&otp=${data.otp}`);
    } catch (err) {
      toast.error("OTP verification failed");
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
        <h2 className="text-xl font-bold text-center">Verify OTP</h2>

        <input
          {...register("otp")}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          className="w-full border px-3 py-2 rounded text-center tracking-widest"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white flex items-center justify-center
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"}`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </>
  );
}
