"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Users,
  Ambulance,
  ListOrdered,
  User,
  Power,
  LogOut,
  FileText,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  role?: string;
}

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserName(parsed?.name || "");
          setUserRole(parsed?.role || "");
        }
      } catch (err) {
        console.error("User parse error in sidebar:", err);
      }
    }
  }, []);


  let activeRole = "CALLER";
  if (pathname.startsWith("/admin")) {
    activeRole = "ADMIN";
  } else if (pathname.startsWith("/driver")) {
    activeRole = "DRIVER";
  } else if (pathname.startsWith("/caller")) {
    activeRole = "CALLER";
  } else if (userRole) {
    activeRole = userRole.toUpperCase();
  } else if (role) {
    activeRole = role.toUpperCase();
  }

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

  const adminLinks = [
    { href: "/admin", label: "ওভারভিউ ও অ্যানালিটিক্স", icon: LayoutDashboard },
    { href: "/admin/requests", label: "জরুরি কল রিকোয়েস্ট", icon: ListOrdered },
    { href: "/admin/ambulances", label: "অ্যাম্বুলেন্স ফ্লিট", icon: Ambulance },
    { href: "/admin/hospitals", label: "হাসপাতাল নেটওয়ার্ক", icon: Building2 },
    { href: "/admin/users", label: "ইউজার ও পারমিশন", icon: Users },
    { href: "/admin/reports", label: "অডিট ও রিপোর্টস", icon: FileText },
  ];

  const driverLinks = [
    { href: "/driver", label: "দায়িত্বপ্রাপ্ত ট্রিপ", icon: ListOrdered },
    { href: "/driver/availability", label: "অনলাইন/অফলাইন ডিউটি", icon: Power },
    { href: "/driver/profile", label: "ড্রাইভার প্রোফাইল", icon: User },
  ];

  const callerLinks = [
    { href: "/caller", label: "আমার রিকোয়েস্ট তালিকা", icon: ListOrdered },
    { href: "/caller/request-ambulance", label: "অ্যাম্বুলেন্স বুকিং", icon: Ambulance },
    { href: "/caller/profile", label: "প্রোফাইল সেটিংস", icon: User },
  ];

  const currentLinks =
    activeRole === "ADMIN" ? adminLinks : activeRole === "DRIVER" ? driverLinks : callerLinks;

  const userInitial = userName ? userName.charAt(0).toUpperCase() : activeRole.charAt(0);

  return (
    <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-4">
        
        <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 border rounded-lg">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
            {userInitial}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">
              {userName || "ইউজার প্রোফাইল"}
            </p>
            <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider block">
              {activeRole} প্যানেল
            </span>
          </div>
        </div>

        
        <div className="space-y-1">
          <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {activeRole} মেনু
          </p>

          {currentLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-600 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      
      <div className="pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> লগআউট করুন
        </Button>
      </div>
    </aside>
  );
}