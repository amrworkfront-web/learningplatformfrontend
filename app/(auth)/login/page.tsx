"use client"
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {useForm} from 'react-hook-form';
import {LoginUser} from '../../utils/userAPI';
import { useMutation } from '@tanstack/react-query';
import FormInput from '@/app/_components/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const loginSchema=z.object({
    email:z.string().email({message:'Invalid email address'}),
    password:z.string().min(6,{message:'Password must be at least 6 characters long'})
});
type FormData = z.infer<typeof loginSchema>

export default function Login() {
  const router=useRouter()
 const {register,handleSubmit,    reset,
    formState: { errors },}=useForm<FormData>({
    resolver:zodResolver(loginSchema)
 })
  
 const {mutate}=useMutation({
    mutationFn:(data:FormData)=>
        LoginUser(data),

    onSuccess:(data)=>{
            router.push('/')

        console.log('Login successful',data);
    },
    onError:(error)=>{
        console.log('Login failed',error);
    }
 })
  return (
<form 
  onSubmit={handleSubmit((data) => mutate(data))} 
  className="flex flex-col gap-5 w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
>
  {/* Header Section */}
  <div className="text-center mb-2">
    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
      Welcome Back 👋
    </h1>
    <p className="text-sm text-gray-500 mt-2">
      Enter your credentials to access your account
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
    
    <div className="relative">
      <FormInput 
        label="Password" 
        type="password" 
        placeholder="••••••••" 
        register={register("password")} 
        error={errors.password} 
      />
      <div className="flex justify-end mt-1">
        <Link  href="/forgot-password" className="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition">
          Forgot password?
        </Link>
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <button 
    type="submit" 
    className="w-full mt-2 rounded-xl bg-emerald-600 py-3 px-4 font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
  >
    Login
  </button>

  {/* Footer */}
  <p className="text-center text-sm text-gray-600 mt-2">
    Don&apos;t have an account?{' '}
    <Link 
 href="/register" className="font-semibold text-emerald-600 hover:underline">Sign up</Link>
  </p>
</form>
  )
}
