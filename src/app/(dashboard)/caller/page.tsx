// src/app/(dashboard)/caller/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Ambulance, Plus, Clock, MapPin, CreditCard, RefreshCw } from "lucide-react";

export default function CallerDashboardPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myEmergencyRequests"],
    queryFn: async () => {
      const res = await api.get("/emergency-requests");
      return res.data?.data || [];
    },
  });

  const handlePayment = async (requestId: string) => {
    try {
      toast.info("bKash পেমেন্ট লোড হচ্ছে...");
      const res = await api.post("/payments/initiate", { requestId });
      const redirectUrl =
        res.data?.data?.paymentUrl ||
        `/payment/success?paymentID=TR_${Date.now()}&status=success`;
      window.location.href = redirectUrl;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "পেমেন্ট শুরু করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            আমার জরুরি অ্যাম্বুলেন্স রিকোয়েস্ট
          </h1>
          <p className="text-sm text-slate-500">
            আপনার বর্তমান ও পূর্বের অ্যাম্বুলেন্স ট্রিপ হিস্ট্রি ও স্ট্যাটাস ট্র্যাকিং
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <RefreshCw className="w-4 h-4" /> রিফ্রেশ
          </Button>
          <Link href="/caller/request-ambulance">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-medium">
              <Plus className="w-4 h-4 mr-1.5" /> নতুন অ্যাম্বুলেন্স কল
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      ) : !data || data.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-slate-300">
          <CardContent className="space-y-3">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Ambulance className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">কোনো রিকোয়েস্ট পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              জরুরি অ্যাম্বুলেন্স প্রয়োজন হলে উপরের &quot;নতুন অ্যাম্বুলেন্স কল&quot; বাটনে ক্লিক করে রিকোয়েস্ট পাঠান।
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.map((req: any) => (
            <Card key={req.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={req.status === "PENDING" ? "secondary" : "default"}>
                      {req.status}
                    </Badge>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">
                      {req.priority} Priority
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {new Date(req.createdAt || Date.now()).toLocaleDateString("bn-BD")}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="font-medium text-slate-500 text-xs">পিকআপ:</span>
                      {req.pickupAddress}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="font-medium text-slate-500 text-xs">গন্তব্য:</span>
                      {req.destinationAddress}
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-slate-500 block">মোট ভাড়া</span>
                    <span className="text-xl font-bold text-slate-900">৳{req.totalAmount}</span>
                  </div>

                  <Button
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium gap-1.5 shadow-sm"
                    onClick={() => handlePayment(req.id)}
                  >
                    <CreditCard className="w-4 h-4" /> bKash পেমেন্ট
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}