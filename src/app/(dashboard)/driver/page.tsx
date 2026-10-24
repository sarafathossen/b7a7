// src/app/(dashboard)/driver/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Ambulance, MapPin, Navigation, CheckCircle, Clock } from "lucide-react";

export default function DriverDashboard() {
  const queryClient = useQueryClient();

  // ড্রাইভারের ট্রিপ লিস্ট ফেচ
  const { data: requests, isLoading } = useQuery({
    queryKey: ["driverTrips"],
    queryFn: async () => {
      const res = await api.get("/emergency-requests");
      return res.data?.data || [];
    },
  });

  // স্ট্যাটাস পরিবর্তনের মিউটেশন
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return api.patch(`/emergency-requests/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success("ট্রিপ স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["driverTrips"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
    },
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ড্রাইভার ট্রিপ ড্যাশবোর্ড</h1>
        <p className="text-sm text-slate-500">আপনার দায়িত্বপ্রাপ্ত জরুরি ট্রিপ এবং স্ট্যাটাস ট্র্যাকিং</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : requests?.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-2">
            <Ambulance className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-lg">কোনো ট্রিপ অ্যাসাইন নেই</h3>
            <p className="text-sm text-slate-500">অ্যাডমিন নতুন কোনো কল অ্যাসাইন করলে এখানে দেখতে পাবেন।</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests?.map((trip: any) => (
            <Card key={trip.id} className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b pb-4 flex flex-row items-center justify-between">
                <div>
                  <Badge variant={trip.status === "COMPLETED" ? "default" : "secondary"}>
                    {trip.status}
                  </Badge>
                  <CardDescription className="text-xs mt-1">
                    আইডি: {trip.id}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-red-600 block">{trip.priority} Priority</span>
                  <span className="text-base font-bold text-slate-900">৳{trip.totalAmount}</span>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" /> রোগীর অবস্থান (পিকআপ):
                    </p>
                    <p className="text-sm font-medium">{trip.pickupAddress}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-blue-500" /> নির্ধারিত গন্তব্য / হাসপাতাল:
                    </p>
                    <p className="text-sm font-medium">{trip.destinationAddress}</p>
                  </div>
                </div>

                {/* স্ট্যাটাস আপডেট অ্যাকশন বাটনসমূহ */}
                <div className="pt-4 border-t flex flex-wrap gap-2 justify-end">
                  {trip.status === "ASSIGNED" && (
                    <Button
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700"
                      onClick={() => statusMutation.mutate({ id: trip.id, status: "EN_ROUTE" })}
                      disabled={statusMutation.isPending}
                    >
                      <Navigation className="w-4 h-4 mr-1.5" /> রোগীর উদ্দেশ্যে রওনা দিন (En Route)
                    </Button>
                  )}

                  {trip.status === "EN_ROUTE" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => statusMutation.mutate({ id: trip.id, status: "PICKED_UP" })}
                      disabled={statusMutation.isPending}
                    >
                      <Clock className="w-4 h-4 mr-1.5" /> রোগীকে তোলা হয়েছে (Picked Up)
                    </Button>
                  )}

                  {trip.status === "PICKED_UP" && (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => statusMutation.mutate({ id: trip.id, status: "COMPLETED" })}
                      disabled={statusMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" /> ট্রিপ সম্পন্ন করুন (Completed)
                    </Button>
                  )}

                  {trip.status === "COMPLETED" && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> এই ট্রিপটি সফলভাবে সম্পন্ন হয়েছে
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}