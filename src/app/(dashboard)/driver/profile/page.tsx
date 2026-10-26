// src/app/(dashboard)/driver/profile/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function DriverProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["currentDriverProfileData"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      // নেটওয়ার্ক ট্যাবের গঠন অনুযায়ী অবজেক্ট এক্সট্রাক্ট করা
      return res.data?.data?.user || res.data?.user || res.data?.data || res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const currentUser = data?.user || data;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const initial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "D";

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-inner">
              {initial}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {currentUser?.name || "নাম লোড হচ্ছে..."}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" /> ভেরিফায়েড অ্যাম্বুলেন্স চালক
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="flex items-center gap-2 text-slate-500 font-medium">
                <Mail className="w-4 h-4 text-slate-400" /> ইমেইল
              </span>
              <span className="font-semibold text-slate-800">{currentUser?.email}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="flex items-center gap-2 text-slate-500 font-medium">
                <Phone className="w-4 h-4 text-slate-400" /> মোবাইল নম্বর
              </span>
              <span className="font-semibold text-slate-800">
                {currentUser?.phone || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2 text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> একাউন্ট রোল
              </span>
              <Badge className="bg-amber-100 text-amber-700 font-bold border-0">
                {currentUser?.role || "DRIVER"}
              </Badge>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>আপনার ড্রাইভিং লাইসেন্স এবং অ্যাম্বুলেন্স ভেরিফিকেশন অ্যাক্টিভ রয়েছে। নিয়মিত ট্রিপ সম্পন্ন করে সেবার মান অক্ষুণ্ণ রাখুন।</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}