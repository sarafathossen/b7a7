
"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RefreshCw,
  Plus,
  MapPin,
  Clock,
  Ban,
  CreditCard,
  Loader2,
} from "lucide-react";
import Link from "next/link";

function CallerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

 
  useEffect(() => {
    const payment = searchParams.get("payment");
    const requestId = searchParams.get("requestId");

    if (payment === "success") {
      toast.success("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!", {
        description: requestId
          ? `ট্রিপ আইডি: ${requestId.slice(0, 8)}... এর পেমেন্ট PAID হিসেবে নিশ্চিত হয়েছে।`
          : "আপনার পেমেন্ট সফল হয়েছে।",
      });
      queryClient.invalidateQueries({ queryKey: ["myAmbulanceRequests"] });
      router.replace("/caller");
    } else if (payment === "failed" || payment === "error") {
      toast.error("পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে বা বাতিল করা হয়েছে।");
      router.replace("/caller");
    }
  }, [searchParams, queryClient, router]);

  
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ["myAmbulanceRequests"],
    queryFn: async () => {
      const res = await api.get("/emergency-requests/my-requests");
      return res.data?.data?.result || res.data?.data || res.data || [];
    },
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 3000, 
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.patch(`/emergency-requests/${id}/cancel`);
    },
    onSuccess: () => {
      toast.success("রিকোয়েস্টটি সফলভাবে বাতিল করা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["myAmbulanceRequests"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "রিকোয়েস্ট বাতিল করতে ব্যর্থ হয়েছে");
    },
  });

  
  const paymentMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await api.post("/payments/initiate", { requestId });
      return res.data?.data || res.data;
    },
    onSuccess: (data) => {
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error("বিকাশ পেমেন্ট ইউআরএল তৈরি করা সম্ভব হয়নি");
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "পেমেন্ট শুরু করতে ব্যর্থ হয়েছে");
    },
  });

  const requestList: any[] = Array.isArray(requests) ? requests : [];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            আমার জরুরি অ্যাম্বুলেন্স রিকোয়েস্ট
          </h1>
          <p className="text-xs text-slate-500">
            আপনার বর্তমান ট্রিপের রিয়্যাল-টাইম স্ট্যাটাস ও পেমেন্ট হিস্ট্রি
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> রিফ্রেশ
          </Button>

          <Link href="/caller/request-ambulance">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1.5">
              <Plus className="w-4 h-4" /> নতুন অ্যাম্বুলেন্স কল
            </Button>
          </Link>
        </div>
      </div>

      
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : requestList.length === 0 ? (
        <Card className="border-dashed p-12 text-center">
          <p className="text-sm text-slate-500">বর্তমানে আপনার কোনো সক্রিয় রিকোয়েস্ট নেই।</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requestList.map((item: any) => {
            const isPaid =
              item.paymentStatus === "PAID" ||
              item.payment?.status === "PAID" ||
              item.status === "PAID";
            const canCancel = item.status === "PENDING" || item.status === "REQUESTED";

            
            const pickupText =
              item.pickupLocation ||
              item.pickupAddress ||
              item.pickup ||
              item.location ||
              "ঠিকানা উল্লেখ নেই";

            const destinationText =
              item.hospital?.name ||
              item.hospitalName ||
              item.destination ||
              item.destinationAddress ||
              item.dropoffAddress ||
              "হাসপাতাল";

            return (
              <Card key={item.id} className="border border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700">
                        {item.status}
                      </span>

                      
                      {isPaid ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          পরিশোধিত (PAID)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                          পেমেন্ট বাকি (UNPAID)
                        </span>
                      )}

                      {item.priority && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase">
                          {item.priority} Priority
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-xs text-slate-400 ml-2">
                        <Clock className="w-3.5 h-3.5" />
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "সময় পাওয়া যায়নি"}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">মোট ভাড়া</p>
                      <p className="text-xl font-bold text-slate-900">
                        ৳{item.totalAmount || item.amount || 2500}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 text-sm">
                      
                      <p className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="font-semibold text-slate-800">পিকআপ:</span>{" "}
                        <span className="text-slate-700 font-mono text-xs">{pickupText}</span>
                      </p>

                      
                      <p className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="font-semibold text-slate-800">গন্তব্য:</span>{" "}
                        <span className="text-slate-700 font-medium">{destinationText}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {canCancel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={cancelMutation.isPending}
                          onClick={() => cancelMutation.mutate(item.id)}
                          className="text-xs text-red-600 hover:bg-red-50 gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" /> বাতিল
                        </Button>
                      )}

                      {!isPaid && (
                        <Button
                          size="sm"
                          disabled={paymentMutation.isPending}
                          onClick={() => paymentMutation.mutate(item.id)}
                          className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold gap-1.5"
                        >
                          {paymentMutation.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5" />
                          )}
                          bKash পেমেন্ট
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

export default function CallerDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <CallerDashboardContent />
    </Suspense>
  );
}