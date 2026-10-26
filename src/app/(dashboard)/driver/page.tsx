
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Phone,
  RefreshCw,
  Loader2,
  Ambulance,
  CheckCircle2,
  Navigation,
  UserCheck,
  XCircle,
} from "lucide-react";

export default function DriverDashboard() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  
  const {
    data: tripsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["driverAssignedTrips"],
    queryFn: async () => {
      try {
        const res = await api.get("/emergency-requests/my-assigned");
        const raw =
          res?.data?.data?.result ||
          res?.data?.data ||
          res?.data?.result ||
          res?.data;

        if (!raw) return [];
        if (!Array.isArray(raw) && typeof raw === "object" && (raw.id || raw._id)) {
          return [raw];
        }
        return Array.isArray(raw) ? raw : [];
      } catch (err: any) {
        return [];
      }
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await api.patch(`/emergency-requests/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`স্ট্যাটাস সফলভাবে '${variables.status}' করা হয়েছে`);
      queryClient.invalidateQueries({ queryKey: ["driverAssignedTrips"] });
      setUpdatingId(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
      setUpdatingId(null);
    },
  });

  const handleStatusChange = (id: string, nextStatus: string) => {
    setUpdatingId(id);
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  const trips: any[] = Array.isArray(tripsData) ? tripsData : [];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
    
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ড্রাইভার ট্রিপ কন্ট্রোল প্যানেল
          </h1>
          <p className="text-xs text-slate-500">
            আপনার দায়িত্বপ্রাপ্ত জরুরি অ্যাম্বুলেন্স কল ও লাইভ স্ট্যাটাস আপডেট
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="text-xs gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`} /> রিফ্রেশ
        </Button>
      </div>

      {isLoading ? (
        <div className="py-24 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : trips.length === 0 ? (
        <Card className="border-dashed py-16 px-6 text-center bg-white shadow-sm rounded-xl">
          <div className="w-14 h-14 bg-slate-50 border rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Ambulance className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">বর্তমানে কোনো অ্যাক্টিভ ট্রিপ নেই</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            নতুন কোনো ইমার্জেন্সি কল অ্যাসাইন করা হলে তা সাথে সাথে এখানে প্রদর্শিত হবে।
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {trips.map((trip: any) => {
            const isUpdating = updatingId === trip.id && updateStatusMutation.isPending;
            const status = (trip.status || "ASSIGNED").toUpperCase();

            const pickup =
              trip.pickupAddress ||
              trip.pickupLocation ||
              "ঠিকানা পাওয়া যায়নি";

            const destination =
              trip.destinationAddress ||
              trip.hospital?.name ||
              "নির্দিষ্ট হাসপাতাল";

            const callerPhone =
              trip.caller?.phone ||
              trip.contactNumber ||
              "ফোন নম্বর নেই";

            return (
              <Card
                key={trip.id || trip._id}
                className="border border-slate-200 shadow-sm overflow-hidden bg-white"
              >
                <CardContent className="p-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          status === "ASSIGNED"
                            ? "bg-amber-100 text-amber-800"
                            : status === "EN_ROUTE"
                            ? "bg-blue-100 text-blue-800"
                            : status === "PICKED_UP"
                            ? "bg-purple-100 text-purple-800"
                            : status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        স্ট্যাটাস: {status}
                      </span>

                      {trip.paymentStatus && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-slate-100 text-slate-700">
                          বিল: {trip.paymentStatus}
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-xs text-slate-400 ml-1">
                        <Clock className="w-3.5 h-3.5" />
                        {trip.createdAt
                          ? new Date(trip.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-slate-800">
                      মোট ভাড়া: ৳{trip.totalAmount || trip.amount || 2500}
                    </div>
                  </div>

                  
                  <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 text-sm flex-1">
                      <p className="flex items-start gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-800">পিকআপ:</strong> {pickup}
                        </span>
                      </p>

                      <p className="flex items-start gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-800">গন্তব্য:</strong> {destination}
                        </span>
                      </p>

                      <p className="flex items-center gap-2 text-slate-600 text-xs">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          <strong className="text-slate-800">রোগী/কলার:</strong>{" "}
                          <a href={`tel:${callerPhone}`} className="text-blue-600 underline">
                            {callerPhone}
                          </a>
                        </span>
                      </p>
                    </div>

                    
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* ১. ASSIGNED -> EN_ROUTE */}
                      {status === "ASSIGNED" && (
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(trip.id, "EN_ROUTE")}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                          রওনা দিন (EN_ROUTE)
                        </Button>
                      )}

                      {/* ২. EN_ROUTE -> PICKED_UP */}
                      {status === "EN_ROUTE" && (
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(trip.id, "PICKED_UP")}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                          রোগী তোলা হয়েছে (PICKED_UP)
                        </Button>
                      )}

                      {/* ৩. PICKED_UP -> COMPLETED */}
                      {status === "PICKED_UP" && (
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(trip.id, "COMPLETED")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          ট্রিপ সমাপ্ত (COMPLETED)
                        </Button>
                      )}

                      {/* ৪. সরাসরি ড্রপডাউন সিলেক্টর (যেকোনো স্ট্যাটাস ম্যানুয়ালি সেট করতে) */}
                      {status !== "COMPLETED" && status !== "CANCELLED" && (
                        <div className="flex items-center gap-1.5 ml-2 border-l pl-3">
                          <select
                            disabled={isUpdating}
                            value={status}
                            onChange={(e) => handleStatusChange(trip.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1.5 bg-slate-50 text-slate-700 font-medium focus:outline-none"
                          >
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="EN_ROUTE">EN_ROUTE</option>
                            <option value="PICKED_UP">PICKED_UP</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(trip.id, "CANCELLED")}
                            className="text-xs px-2 h-7"
                            title="ট্রিপ বাতিল করুন"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}

                      {status === "COMPLETED" && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> ট্রিপ সম্পন্ন হয়েছে
                        </span>
                      )}

                      {status === "CANCELLED" && (
                        <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> ট্রিপ বাতিল করা হয়েছে
                        </span>
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