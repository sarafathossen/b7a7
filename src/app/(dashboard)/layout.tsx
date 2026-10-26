
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DashboardSidebar from "@/components/shared/dashboard-sidebar";
import Navbar from "@/components/shared/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string>("CALLER");

  useEffect(() => {
    const userRole = Cookies.get("userRole");
    if (userRole) setRole(userRole);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        
        <div className="hidden md:block">
          <DashboardSidebar role={role} />
        </div>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}