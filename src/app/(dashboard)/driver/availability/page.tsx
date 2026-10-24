// src/app/(dashboard)/driver/availability/page.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Power, CheckCircle, XCircle } from "lucide-react";

export default function DriverAvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);

  const toggleMutation = useMutation({
    mutationFn: async (status: boolean) => {
      return api.patch("/drivers/availability", { isAvailable: status });
    },
    onSuccess: (_, status) => {
      setIsAvailable(status);
      toast.success(status ? "আপনি এখন ডিউটিতে আছেন (Online)!" : "আপনি এখন অফলাইনে আছেন!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 my-10">
      <Card className="text-center border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl">ডিউটি স্ট্যাটাস ম্যানেজমেন্ট</CardTitle>
          <CardDescription>
            নতুন ট্রিপের নোটিফিকেশন পেতে আপনার প্রাপ্যতা অন রাখুন
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-2">
            {isAvailable ? (
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full">
                <CheckCircle className="w-12 h-12" />
              </div>
            ) : (
              <div className="p-4 bg-slate-100 text-slate-400 rounded-full">
                <XCircle className="w-12 h-12" />
              </div>
            )}
            <h3 className="text-lg font-bold">
              {isAvailable ? "আপনি এখন অ্যাক্টিভ আছেন" : "আপনি অফলাইনে আছেন"}
            </h3>
            <p className="text-xs text-slate-500">
              {isAvailable
                ? "অ্যাডমিন আপনাকে নতুন ট্রিপ অ্যাসাইন করতে পারবেন"
                : "নতুন কোনো অ্যাসাইনমেন্ট আসবে না"}
            </p>
          </div>

          <Button
            size="lg"
            className={`w-full font-semibold ${
              isAvailable
                ? "bg-slate-800 hover:bg-slate-900 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
            disabled={toggleMutation.isPending}
            onClick={() => toggleMutation.mutate(!isAvailable)}
          >
            <Power className="w-4 h-4 mr-2" />
            {isAvailable ? "অফলাইনে যান (Go Offline)" : "ডিউটি শুরু করুন (Go Online)"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
