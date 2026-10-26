
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Power, Shield } from "lucide-react";

export default function DriverAvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleDuty = async () => {
    setLoading(true);
    const nextStatus = !isAvailable;
    try {
      
      await api.patch("/drivers/availability", {
        isAvailable: nextStatus,
      });

      setIsAvailable(nextStatus);
      toast.success(nextStatus ? "আপনি এখন অনলাইনে আছেন ও নতুন ট্রিপ পাবেন" : "আপনি অফলাইনে চলে গেছেন");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "ডিউটি স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">ডিউটি স্ট্যাটাস নিয়ন্ত্রণ</h1>
        <p className="text-sm text-slate-500">আপনার শিফটের ওপর ভিত্তি করে অনলাইন অথবা অফলাইন নির্ধারণ করুন।</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${
            isAvailable ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
          }`}>
            <Power className="w-10 h-10" />
          </div>
          <CardTitle className="text-xl font-bold">
            {isAvailable ? "অনলাইন (ডিউটিতে আছেন)" : "অফলাইন (বিরতিতে আছেন)"}
          </CardTitle>
          <CardDescription className="text-xs">
            {isAvailable ? "সেন্ট্রাল ডিসপ্যাচ থেকে জরুরি রিকোয়েস্ট সরাসরি আপনার কাছে আসবে" : "নতুন কোনো ট্রিপ আপনার জন্য অ্যাসাইন হবে না"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Badge variant={isAvailable ? "default" : "secondary"}>
              {isAvailable ? "অ্যাক্টিভ ও প্রস্তুত" : "ডিউটি বন্ধ"}
            </Badge>
          </div>

          <Button
            size="lg"
            disabled={loading}
            onClick={toggleDuty}
            className={`w-full font-bold shadow-md ${
              isAvailable ? "bg-slate-800 hover:bg-slate-900 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {loading ? "আপডেট হচ্ছে..." : isAvailable ? "অফলাইন মোডে যান" : "অনলাইন মোডে যান"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}