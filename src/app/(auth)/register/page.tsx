// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Ambulance, Loader2 } from "lucide-react";

import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CALLER",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await api.post("/auth/register", data);
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে লগইন করুন।");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full mb-1">
            <Ambulance className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500">জরুরি সেবার সাথে যুক্ত হতে তথ্য পূরণ করুন</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">পুরো নাম</Label>
            <Input
              id="name"
              placeholder="আপনার পুরো নাম"
              {...register("name")}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">ইমেইল অ্যাড্রেস</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              {...register("email")}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">মোবাইল নম্বর</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="017XXXXXXXX"
              {...register("phone")}
              disabled={loading}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-1">
            <Label htmlFor="role">একাউন্টের ধরন (রোল)</Label>
            <select
              id="role"
              {...register("role")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              <option value="CALLER">Caller (অ্যাম্বুলেন্স বুকিং ইউজার)</option>
              <option value="DRIVER">Driver (অ্যাম্বুলেন্স চালক)</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500 font-medium">{errors.role.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            অ্যাকাউন্ট তৈরি করুন
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="font-semibold text-red-600 hover:underline">
            লগইন করুন
          </Link>
        </p>

      </div>
    </div>
  );
}