"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { RegisterUser } from "../../utils/userAPI"
import FormInput from "@/app/_components/FormInput"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Presentation,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"

/* -------------------- Roles -------------------- */
const roles = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "instructor", label: "Instructor", icon: Presentation },
  { value: "admin", label: "Admin", icon: ShieldCheck },
] as const

/* -------------------- Zod Schema -------------------- */
const registerSchema = z.object({
  role: z.enum(["student", "instructor", "admin"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof registerSchema>

/* -------------------- Component -------------------- */
export default function Register() {
  const router=useRouter()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
    },
  })

  const selectedRole = watch("role")

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => RegisterUser(data),
    onSuccess: () =>{ reset()
      router.push('/')
    },
  })

  return (
    <form
      onSubmit={handleSubmit((data) => mutate(data))}
      className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl border shadow-sm flex flex-col gap-6"
    >
      {/* ---------- Header ---------- */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Account ✨
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Join our platform and start learning
        </p>
      </div>

      {/* ---------- Role Selector ---------- */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Select Role
        </label>

        <div className="grid grid-cols-3 gap-3">
          {roles.map(({ value, label, icon: Icon }) => {
            const active = selectedRole === value

            return (
              <label
                key={value}
                className={`
                  cursor-pointer rounded-xl border p-4 flex flex-col items-center gap-2
                  transition
                  ${active
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 hover:border-gray-300"}
                `}
              >
                <input
                  type="radio"
                  value={value}
                  {...register("role")}
                  className="hidden"
                />
                <Icon size={26} />
                <span className="text-sm font-medium">{label}</span>
              </label>
            )
          })}
        </div>

        {errors.role && (
          <p className="text-xs text-red-500">{errors.role.message}</p>
        )}
      </div>

      {/* ---------- Inputs ---------- */}
      <FormInput
        label="Full Name"
        type="text"
        placeholder="John Doe"
        register={register("name")}
        error={errors.name}
      />

      <FormInput
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        register={register("email")}
        error={errors.email}
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="••••••••"
        register={register("password")}
        error={errors.password}
      />

      {/* ---------- Submit ---------- */}
      <button
        type="submit"
        disabled={isPending}
        className="
          w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white
          hover:bg-emerald-700 transition
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {isPending ? "Creating account..." : "Create Account"}
      </button>

      {/* ---------- Footer ---------- */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  )
}
