// src/app/(dashboard)/driver/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Ambulance, MapPin, Navigation, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function DriverDashboardPage() {
  const queryClient = useQueryClient();

  const { data: trips, isLoading, refetch } = useQuery({
    queryKey: ["driverTrips"],
    queryFn: async () => {
      try {
        const res = await api.get("/emergency-requests");
        return res.data?.data?.result || res.data?.data || [];
      } catch {
        return [];
      }
    },
  });

  // পোস্টম্যান অনুযায়ী স্ট্যাটাস পরিবর্তন মিউটেশন
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await api.patch(`/emergency-requests/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`ট্রিপের স্ট্যাটাস সফলভাবে "${variables.status}" এ আপডেট হয়েছে!`);
      queryClient.invalidateQueries({ queryKey: ["driverTrips"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">ড্রাইভার ট্রিপ কন্ট্রোল প্যানেল</h1>
          <p className="text-sm text-slate-500">আপনার দায়িত্বপ্রাপ্ত জরুরি অ্যাম্বুলেন্স কল ও লাইভ স্ট্যাটাস আপডেট</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw className="w-4 h-4" /> রিফ্রেশ
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : !trips || trips.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          <CardContent className="space-y-2">
            <Ambulance className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-semibold text-slate-700">বর্তমানে কোনো ট্রিপ অ্যাসাইন নেই</h3>
            <p className="text-xs text-slate-500">অ্যাডমিন নতুন কোনো রিকোয়েস্ট অ্যাসাইন করলে এখানে তালিকা দেখতে পাবেন।</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip: any) => (
            <Card key={trip.id} className="border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant={trip.status === "COMPLETED" ? "default" : "secondary"}>
                      {trip.status}
                    </Badge>
                    <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {trip.priority} Priority
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">৳{trip.totalAmount}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-xs text-slate-500">পিকআপ:</span> {trip.pickupAddress}
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-xs text-slate-500">গন্তব্য:</span> {trip.destinationAddress}
                  </p>
                </div>

                {/* স্ট্যাটাস ট্রানজিশন বাটনসমূহ */}
                <div className="pt-2 border-t flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateStatusMutation.isPending || trip.status === "EN_ROUTE"}
                    onClick={() => updateStatusMutation.mutate({ id: trip.id, status: "EN_ROUTE" })}
                  >
                    🚀 En Route (রওনা দিয়েছি)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updateStatusMutation.isPending || trip.status === "PICKED_UP"}
                    onClick={() => updateStatusMutation.mutate({ id: trip.id, status: "PICKED_UP" })}
                  >
                    🏥 Picked Up (রোগী গাড়িতে)
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={updateStatusMutation.isPending || trip.status === "COMPLETED"}
                    onClick={() => updateStatusMutation.mutate({ id: trip.id, status: "COMPLETED" })}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Complete (ট্রিপ সম্পন্ন)
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