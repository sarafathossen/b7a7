// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Ambulance, ShieldAlert, User, Truck, Loader2 } from "lucide-react";

import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const executeLogin = async (email: string, pass: string, assignedRole?: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email,
        password: pass,
      });

      const { accessToken, refreshToken, user } = res.data?.data || {};

      if (accessToken) {
        Cookies.set("accessToken", accessToken, { expires: 7 });
        if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 30 });

        const userRole = user?.role || assignedRole;
        Cookies.set("userRole", userRole, { expires: 7 });

        toast.success("লগইন সফল হয়েছে!");

        if (userRole === "ADMIN") {
          router.push("/admin");
        } else if (userRole === "DRIVER") {
          router.push("/driver");
        } else {
          router.push("/caller");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: LoginFormData) => {
    executeLogin(data.email, data.password);
  };

  const handleQuickDemo = (email: string, pass: string, role: string) => {
    setValue("email", email);
    setValue("password", pass);
    executeLogin(email, pass, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full mb-1">
            <Ambulance className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back 👋</h1>
          <p className="text-sm text-slate-500">জরুরি অ্যাম্বুলেন্স সেবায় প্রবেশ করতে লগইন করুন</p>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            লগইন করুন
          </Button>
        </form>

        {/* One-Click Quick Demo Login Section */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-500 font-medium">অথবা কুইক ডেমো লগইন</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex flex-col h-auto py-2.5 items-center gap-1 hover:border-red-500 hover:bg-red-50"
            onClick={() => handleQuickDemo("admin@example.com", "Admin@password123", "ADMIN")}
            disabled={loading}
          >
            <ShieldAlert className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold">Admin</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex flex-col h-auto py-2.5 items-center gap-1 hover:border-red-500 hover:bg-red-50"
            onClick={() => handleQuickDemo("caller@example.com", "Caller@password123", "CALLER")}
            disabled={loading}
          >
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold">Caller</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex flex-col h-auto py-2.5 items-center gap-1 hover:border-red-500 hover:bg-red-50"
            onClick={() => handleQuickDemo("driver@example.com", "Driver@password123", "DRIVER")}
            disabled={loading}
          >
            <Truck className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold">Driver</span>
          </Button>
        </div>

        <p className="text-center text-xs text-slate-500">
          নতুন একাউন্ট খুলতে চান?{" "}
          <Link href="/register" className="font-semibold text-red-600 hover:underline">
            রেজিস্টার করুন
          </Link>
        </p>

      </div>
    </div>
  );
}