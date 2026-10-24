// src/components/shared/dashboard-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
    router.push("/login");
  };

  const adminLinks = [
    { href: "/admin", label: "ওভারভিউ ও অ্যানালিটিক্স", icon: LayoutDashboard },
    { href: "/admin/requests", label: "জরুরি কল রিকোয়েস্ট", icon: ListOrdered },
    { href: "/admin/ambulances", label: "অ্যাম্বুলেন্স ফ্লিট", icon: Ambulance },
    { href: "/admin/users", label: "ইউজার ও পারমিশন", icon: Users },
    { href: "/admin/reports", label: "অডিট ও রিপোর্টস", icon: FileText },
  ];

  const callerLinks = [
    { href: "/caller", label: "আমার রিকোয়েস্ট তালিকা", icon: ListOrdered },
    { href: "/caller/request-ambulance", label: "অ্যাম্বুলেন্স বুকিং", icon: Ambulance },
    { href: "/caller/profile", label: "প্রোফাইল সেটিংস", icon: User },
  ];

  const driverLinks = [
    { href: "/driver", label: "দায়িত্বপ্রাপ্ত ট্রিপ", icon: ListOrdered },
    { href: "/driver/availability", label: "অনলাইন/অফলাইন ডিউটি", icon: Power },
    { href: "/driver/profile", label: "ড্রাইভার প্রোফাইল", icon: User },
  ];

  const currentLinks =
    role === "ADMIN" ? adminLinks : role === "DRIVER" ? driverLinks : callerLinks;

  return (
    <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role} মেনু
        </p>
        {currentLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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