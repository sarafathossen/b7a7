
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, User, Truck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  const processLogin = async (loginEmail: string, loginPassword: string) => {
    if (!loginEmail || !loginPassword) {
      toast.error("ইমেইল এবং পাসওয়ার্ড প্রদান করুন");
      return;
    }

    setLoading(true);
    try {
      
      localStorage.clear();
      sessionStorage.clear();
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("token", { path: "/" });
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      
      const res = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const rawData = res.data?.data || res.data;
      const token = rawData?.accessToken || rawData?.token;
      const user = rawData?.user || rawData?.profile || rawData;

      if (!token) {
        throw new Error("টোকেন পাওয়া যায়নি");
      }

      
      localStorage.setItem("accessToken", token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      Cookies.set("accessToken", token, { expires: 1, path: "/" });
      Cookies.set("token", token, { expires: 1, path: "/" });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      
      const rawRole = user?.role || rawData?.role || "";
      const userRole = String(rawRole).trim().toUpperCase();

      toast.success(`${user?.name || "ইউজার"} (${userRole}) হিসেবে লগইন সফল হয়েছে!`);

      if (userRole === "ADMIN") {
        window.location.replace("/admin");
      } else if (userRole === "DRIVER") {
        window.location.replace("/driver");
      } else {
        window.location.replace("/caller");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  
  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formEmail = (formData.get("email") as string)?.trim() || email.trim();
    const formPassword = (formData.get("password") as string) || password;
    processLogin(formEmail, formPassword);
  };

  
  const handleOneClickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    processLogin(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🚑
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back 👋</h1>
            <p className="text-xs text-slate-500">জরুরি অ্যাম্বুলেন্স সেবায় প্রবেশ করতে লগইন করুন</p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ইমেইল অ্যাড্রেস</label>
              <Input
                name="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">পাসওয়ার্ড</label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              লগইন করুন
            </Button>
          </form>

          
          <div className="space-y-3 pt-2">
            <div className="relative text-center text-xs text-slate-400 after:content-[''] after:absolute after:top-1/2 after:left-0 after:w-full after:h-[1px] after:bg-slate-200">
              <span className="bg-white px-2 relative z-10 font-medium">অথবা ১-ক্লিক ডেমো লগইন</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                className="text-xs gap-1 py-1.5 hover:border-red-500 hover:text-red-600 transition-colors"
                onClick={() => handleOneClickDemo("admin@example.com", "Admin@password123")}
              >
                <Shield className="w-3.5 h-3.5 text-red-600" /> Admin
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                className="text-xs gap-1 py-1.5 hover:border-blue-500 hover:text-blue-600 transition-colors"
                onClick={() => handleOneClickDemo("caller@example.com", "Caller@password123")}
              >
                <User className="w-3.5 h-3.5 text-blue-600" /> Caller
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                className="text-xs gap-1 py-1.5 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                onClick={() => handleOneClickDemo("driver@example.com", "Driver@password123")}
              >
                <Truck className="w-3.5 h-3.5 text-emerald-600" /> Driver
              </Button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            নতুন একাউন্ট খুলতে চান?{" "}
            <Link href="/register" className="font-semibold text-red-600 hover:underline">
              রেজিস্টার করুন
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}