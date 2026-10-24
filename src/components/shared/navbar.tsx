// src/components/shared/navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Ambulance, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userRole = Cookies.get("userRole");
    if (userRole) setRole(userRole);
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
    setRole(null);
    router.push("/login");
  };

  const getDashboardLink = () => {
    if (role === "ADMIN") return "/admin";
    if (role === "DRIVER") return "/driver";
    return "/caller";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-red-600 rounded-lg text-white">
            <Ambulance className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
            Ambu<span className="text-red-600">Quick</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-red-600 transition-colors">হোম</Link>
          <Link href="/services" className="hover:text-red-600 transition-colors">সার্ভিসসমূহ</Link>
          <Link href="/pricing" className="hover:text-red-600 transition-colors">ভাড়ার তালিকা</Link>
          <Link href="/hospitals" className="hover:text-red-600 transition-colors">হাসপাতাল তালিকা</Link>
          <Link href="/about" className="hover:text-red-600 transition-colors">আমাদের সম্পর্কে</Link>
          <Link href="/contact" className="hover:text-red-600 transition-colors">যোগাযোগ</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {role ? (
            <>
              <Link href={getDashboardLink()}>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" /> ড্যাশবোর্ড
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">লগইন</Button>
              </Link>
              <Link href="/caller/request-ambulance">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm">
                  জরুরি অ্যাম্বুলেন্স
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-white px-4 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-700 font-medium">হোম</Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-700 font-medium">সার্ভিসসমূহ</Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-700 font-medium">ভাড়ার তালিকা</Link>
          <Link href="/hospitals" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-700 font-medium">হাসপাতাল তালিকা</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-700 font-medium">আমাদের সম্পর্কে</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-700 font-medium">যোগাযোগ</Link>
          <div className="pt-2 border-t flex flex-col gap-2">
            {role ? (
              <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center">ড্যাশবোর্ড</Button>
              </Link>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-red-600 hover:bg-red-700">লগইন করুন</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}