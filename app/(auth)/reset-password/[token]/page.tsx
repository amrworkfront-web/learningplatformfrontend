"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ResetPassword } from "@/app/utils/userAPI";
import FormInput from "@/app/_components/FormInput";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (password: string) => ResetPassword(token, password),
    onSuccess: () => {
      // Show success message (uncomment when toast is available)
      // toast.success("Password reset successful! Please log in with your new password.");
      alert("Password reset successful! Please log in with your new password.");
      router.push("/login");
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || "Something went wrong";
      
      // Check if token is expired
      if (errorMessage.includes("expired")) {
        // Don't auto-redirect, let user see the error and CTA button
        return;
      }
      
      // For invalid token, show error briefly then redirect
      if (errorMessage.includes("Invalid")) {
        // toast.error(errorMessage);
        alert(errorMessage);
        setTimeout(() => router.push("/forgot-password"), 2000);
      }
    },
  });

  const onSubmit = (data: FormData) => {    
    mutation.mutate(data.password);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter your new password
        </p>
      </div>
      {/* Password Input */}
      <div className="space-y-4">
        <FormInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          register={register("password")}
          error={errors.password}
        />
      </div>

      {/* Error Message */}
      {mutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">
            {mutation.error?.response?.data?.message || "Something went wrong"}
          </p>
          {/* Show CTA for expired token */}
          {mutation.error?.response?.data?.message?.includes("expired") && (
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="mt-3 w-full rounded-lg bg-red-600 py-2 px-4 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Request New Reset Link
            </button>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full mt-2 rounded-xl bg-emerald-600 py-3 px-4 font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {mutation.isPending ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );
}
