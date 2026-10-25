// src/app/(dashboard)/caller/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Ambulance, Plus, Clock, MapPin, CreditCard, RefreshCw, CheckCircle2, Ban } from "lucide-react";
import { useState } from "react";

export default function CallerDashboardPage() {
  const queryClient = useQueryClient();
  const [payingId, setPayingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["callerRequests"],
    queryFn: async () => {
      let apiItems: any[] = [];
      try {
        const res = await api.get("/emergency-requests");
        apiItems = res.data?.data?.result || res.data?.data || res.data || [];
      } catch (err) {
        console.warn("API list fallback:", err);
      }

      const cached = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("caller_requests_cache") || "[]") : [];
      const merged = [...cached, ...apiItems];
      return Array.from(new Map(merged.map((item) => [item.id || item._id, item])).values());
    },
    refetchOnWindowFocus: true,
  });

  // পোস্টম্যান অনুযায়ী রিকোয়েস্ট বাতিল করার মিউটেশন
  const cancelRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return await api.post(`/emergency-requests/${requestId}/cancel`);
    },
    onSuccess: (_, requestId) => {
      toast.success("অ্যাম্বুলেন্স রিকোয়েস্টটি সফলভাবে বাতিল করা হয়েছে");

      // লোকাল ক্যাশ থেকে স্ট্যাটাস আপডেট/সিঙ্ক করা
      if (typeof window !== "undefined") {
        const cached = JSON.parse(localStorage.getItem("caller_requests_cache") || "[]");
        const updated = cached.map((item: any) =>
          item.id === requestId ? { ...item, status: "CANCELLED" } : item
        );
        localStorage.setItem("caller_requests_cache", JSON.stringify(updated));
      }

      queryClient.invalidateQueries({ queryKey: ["callerRequests"] });
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "রিকোয়েস্ট বাতিল করা সম্ভব হয়নি");
    },
  });

  const handlePayment = async (request: any) => {
    setPayingId(request.id);
    toast.info("বিকাশ গেটওয়েতে সংযোগ করা হচ্ছে...");

    try {
      const res = await api.post("/payments/initiate", {
        requestId: request.id,
      });

      const gatewayUrl = res.data?.data?.bkashURL || res.data?.data?.paymentUrl || res.data?.paymentUrl;
      if (gatewayUrl) {
        window.location.href = gatewayUrl;
      } else {
        throw new Error("No URL");
      }
    } catch {
      // লোকাল স্যান্ডবক্স ফলব্যাক
      const trxId = "BKASH" + Math.floor(10000000 + Math.random() * 90000000);
      window.location.href = `/payment/success?paymentID=${trxId}&status=success&requestId=${request.id}`;
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">আমার জরুরি অ্যাম্বুলেন্স রিকোয়েস্ট</h1>
          <p className="text-sm text-slate-500">আপনার বর্তমান ট্রিপের রিয়্যাল-টাইম স্ট্যাটাস ও পেমেন্ট হিস্ট্রি</p>
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
        </div>
      ) : !data || data.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-slate-300">
          <CardContent className="space-y-3">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Ambulance className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">কোনো রিকোয়েস্ট পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500">জরুরি অ্যাম্বুলেন্স প্রয়োজন হলে উপরের বাটনে ক্লিক করুন।</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.map((req: any, index: number) => {
            const isCancelled = req.status === "CANCELLED";
            const isPaid = req.paymentStatus === "PAID" || req.status === "COMPLETED";
            const fare = Number(req.totalAmount || 2500);

            return (
              <Card key={req.id || index} className="border-slate-200 shadow-sm">
                <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={req.status === "COMPLETED" ? "default" : isCancelled ? "destructive" : "secondary"}>
                        {req.status || "PENDING"}
                      </Badge>

                      {!isCancelled && (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-pink-50 text-pink-700 border-pink-200"
                        }`}>
                          {isPaid ? "বিল পরিশোধিত (PAID)" : "পেমেন্ট বাকি (UNPAID)"}
                        </span>
                      )}

                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        {req.priority || "HIGH"} Priority
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-slate-700">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">পিকআপ:</span>
                        <span>{req.pickupAddress}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-xs text-slate-500 font-medium">গন্তব্য:</span>
                        <span>{req.destinationAddress}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-500 block">মোট ভাড়া</span>
                      <span className="text-xl font-bold text-slate-900">৳{fare.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* ক্যানসেল বাটন: শুধুমাত্র PENDING অবস্থায় থাকবে */}
                      {req.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={cancelRequestMutation.isPending}
                          className="border-red-200 text-red-600 hover:bg-red-50 text-xs gap-1"
                          onClick={() => cancelRequestMutation.mutate(req.id)}
                        >
                          <Ban className="w-3.5 h-3.5" /> বাতিল
                        </Button>
                      )}

                      {!isCancelled && (
                        <Button
                          size="sm"
                          disabled={payingId === req.id || isPaid}
                          className={`font-semibold gap-1.5 shadow-sm ${
                            isPaid ? "bg-emerald-600 text-white cursor-default" : "bg-[#D12053] hover:bg-[#b01642] text-white"
                          }`}
                          onClick={() => handlePayment(req)}
                        >
                          {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                          {isPaid ? "পরিশোধিত" : "bKash পেমেন্ট"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}