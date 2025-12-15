"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  otp: string;
};

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    router.push(
      `/reset-password?email=${email}&otp=${data.otp}`
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-bold text-center">Verify OTP</h2>

      <input
        {...register("otp")}
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        className="w-full border px-3 py-2 rounded"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Verify OTP
      </button>
    </form>
  );
}
