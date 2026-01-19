"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ForgotPassword } from "../../utils/userAPI";
import { useMutation } from "@tanstack/react-query";
import FormInput from "@/app/_components/FormInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => ForgotPassword(data),
    onSuccess: (data) => {
    //   toast.success("Reset link sent! Check your email.");
      reset();
      router.push("/"); // or router.push("/check-email")
    },
    // onError: (error: any) => {
    //   toast.error("Request failed", {
    //     description:
    //       error.response?.data?.message ||
    //       "Please check your email and try again.",
    //   });
    // },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutate(data))}
      className="flex flex-col gap-5 w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
    >
      {/* Header Section */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Forgot Password 🔒
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email to receive reset instructions
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          register={register("email")}
          error={errors.email}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 rounded-xl bg-emerald-600 py-3 px-4 font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {isPending ? "Sending..." : "Send Reset Link"}
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 mt-2">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
