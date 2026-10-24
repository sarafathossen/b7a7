// src/app/(dashboard)/driver/profile/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Phone, Mail, Award, ShieldCheck } from "lucide-react";

export default function DriverProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data?.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-60 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 my-6 space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10" />
          </div>
          <CardTitle className="text-xl font-bold">{user?.name || "ড্রাইভার প্রোফাইল"}</CardTitle>
          <CardDescription className="text-xs flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ভেরিফায়েড অ্যাম্বুলেন্স চালক
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center py-2 border-b text-sm">
            <span className="text-slate-500 flex items-center gap-2">
              <Mail className="w-4 h-4" /> ইমেইল
            </span>
            <span className="font-medium text-slate-800">{user?.email}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b text-sm">
            <span className="text-slate-500 flex items-center gap-2">
              <Phone className="w-4 h-4" /> মোবাইল নম্বর
            </span>
            <span className="font-medium text-slate-800">{user?.phone || "01750187656"}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b text-sm">
            <span className="text-slate-500 flex items-center gap-2">
              <Award className="w-4 h-4" /> একাউন্ট রোল
            </span>
            <Badge variant="outline" className="text-amber-600 font-bold border-amber-300">
              {user?.role || "DRIVER"}
            </Badge>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-800">
            ✅ আপনার ড্রাইভিং লাইসেন্স এবং অ্যাম্বুলেন্স ভেরিফিকেশন অ্যাক্টিভ রয়েছে। নিয়মিত ট্রিপ সম্পন্ন করে সেবার মান অক্ষুণ্ণ রাখুন।
          </div>
        </CardContent>
      </Card>
    </div>
  );
}