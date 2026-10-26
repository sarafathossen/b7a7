
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Ambulance, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("CALLER");

  useEffect(() => {
    
    const token =
      Cookies.get("accessToken") ||
      Cookies.get("token") ||
      (typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null);

    if (token) {
      setIsLoggedIn(true);
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserRole(parsed?.role || "CALLER");
        }
      } catch (err) {
        console.error("User parse error in navbar:", err);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("token", { path: "/" });
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.replace("/login");
  };

  
  const dashboardHref =
    userRole === "ADMIN"
      ? "/admin"
      : userRole === "DRIVER"
      ? "/driver"
      : "/caller";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm">
            <Ambulance className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Ambu<span className="text-red-600">Quick</span>
          </span>
        </Link>

        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-red-600 transition-colors">
            হোম
          </Link>
          <Link href="/#services" className="hover:text-red-600 transition-colors">
            সার্ভিসসমূহ
          </Link>
          <Link href="/#pricing" className="hover:text-red-600 transition-colors">
            ভাড়ার তালিকা
          </Link>
          <Link href="/#hospitals" className="hover:text-red-600 transition-colors">
            হাসপাতাল তালিকা
          </Link>
          <Link href="/#about" className="hover:text-red-600 transition-colors">
            আমাদের সম্পর্কে
          </Link>
          <Link href="/#contact" className="hover:text-red-600 transition-colors">
            যোগাযোগ
          </Link>
        </nav>

        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href={dashboardHref}>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-red-600" /> ড্যাশবোর্ড
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> লগআউট
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors px-2 py-1"
            >
              লগইন
            </Link>
          )}

          <Link href="/caller/request-ambulance">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg px-3">
              জরুরি অ্যাম্বুলেন্স
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}